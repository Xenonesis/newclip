import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { z } from "zod";

const fetchLimiter = rateLimit({ interval: 60 * 1000, limit: 60 });
const mutateLimiter = rateLimit({ interval: 60 * 1000, limit: 30 });

const scheduleSchema = z.object({
  clipId: z.string().min(1, "Clip ID is required"),
  platform: z.enum(["INSTAGRAM", "TIKTOK", "YOUTUBE", "LINKEDIN", "TWITTER", "FACEBOOK"]),
  scheduledAt: z.string().datetime("Invalid date format"),
  caption: z.string().max(2200, "Caption too long").optional(),
  hashtags: z.array(z.string().max(50)).max(30).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const { success, remaining, reset } = await mutateLimiter(req);
    if (!success) {
      return rateLimitResponse(reset);
    }

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

    const response = NextResponse.json({
      message: "Post scheduled successfully",
      post: {
        id: scheduledPost.id,
        platform: scheduledPost.platform,
        scheduledAt: scheduledPost.scheduledAt.toISOString(),
        status: scheduledPost.status,
      },
    });
    
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    return response;
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
    // Rate limiting
    const { success, remaining, reset } = await fetchLimiter(req);
    if (!success) {
      return rateLimitResponse(reset);
    }

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

    const response = NextResponse.json({
      posts: posts.map(p => ({
        id: p.id,
        platform: p.platform,
        scheduledAt: p.scheduledAt.toISOString(),
        status: p.status,
        caption: p.caption,
        clip: p.clip,
      })),
    });
    
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    return response;
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
    // Rate limiting
    const { success, remaining, reset } = await mutateLimiter(req);
    if (!success) {
      return rateLimitResponse(reset);
    }

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

    const response = NextResponse.json({ message: "Post deleted successfully" });
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    return response;
  } catch (error) {
    console.error("Delete schedule error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
