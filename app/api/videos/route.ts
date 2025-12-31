import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  sourceUrl: z.string().url().optional(),
  settings: z.object({
    maxClips: z.number().min(1).max(50).default(10),
    duration: z.string().default("30-60"),
    platforms: z.array(z.string()).default(["tiktok", "instagram"]),
    autoCaptions: z.boolean().default(true),
    captionStyle: z.string().default("hormozi"),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, sourceUrl, settings } = uploadSchema.parse(body);

    // Create video record
    const video = await prisma.video.create({
      data: {
        userId: session.user.id,
        title,
        sourceUrl,
        status: "PENDING",
        metadata: settings,
      },
    });

    // In production, this would trigger a background job for processing
    // For now, we'll simulate the start of processing
    
    return NextResponse.json({
      message: "Video upload started",
      video: {
        id: video.id,
        title: video.title,
        status: video.status,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Upload error:", error);
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
    const status = searchParams.get("status");

    const videos = await prisma.video.findMany({
      where: {
        userId: session.user.id,
        ...(status && { status: status as "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" }),
      },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { clips: true },
        },
      },
    });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Fetch videos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
