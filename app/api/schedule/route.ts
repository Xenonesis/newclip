import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const scheduleSchema = z.object({
  clipId: z.string(),
  platform: z.enum(["INSTAGRAM", "TIKTOK", "YOUTUBE", "LINKEDIN", "TWITTER", "FACEBOOK"]),
  scheduledAt: z.string().datetime(),
  caption: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { clipId, platform, scheduledAt, caption, hashtags } = scheduleSchema.parse(body);

    // Verify clip ownership
    const clip = await prisma.clip.findFirst({
      where: { id: clipId, userId: session.user.id },
    });

    if (!clip) {
      return NextResponse.json({ error: "Clip not found" }, { status: 404 });
    }

    const scheduledPost = await prisma.scheduledPost.create({
      data: {
        userId: session.user.id,
        clipId,
        platform,
        scheduledAt: new Date(scheduledAt),
        caption,
        hashtags: hashtags || [],
        status: "SCHEDULED",
      },
    });

    // Update clip status
    await prisma.clip.update({
      where: { id: clipId },
      data: { status: "SCHEDULED" },
    });

    return NextResponse.json({
      message: "Post scheduled successfully",
      post: scheduledPost,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Schedule error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");

    const posts = await prisma.scheduledPost.findMany({
      where: {
        userId: session.user.id,
        ...(status && { status: status as "SCHEDULED" | "PUBLISHING" | "PUBLISHED" | "FAILED" }),
        ...(startDate && endDate && {
          scheduledAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      },
      orderBy: { scheduledAt: "asc" },
      include: {
        clip: {
          select: {
            id: true,
            title: true,
            thumbnailUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Fetch schedule error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    // Verify ownership
    const post = await prisma.scheduledPost.findFirst({
      where: { id: postId, userId: session.user.id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.scheduledPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete schedule error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
