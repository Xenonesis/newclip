import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { z } from "zod";

const fetchLimiter = rateLimit({ interval: 60 * 1000, limit: 60 });
const updateLimiter = rateLimit({ interval: 60 * 1000, limit: 30 });

const updateClipSchema = z.object({
  clipId: z.string().min(1, "Clip ID is required"),
  updates: z.object({
    title: z.string().max(200).optional(),
    status: z.enum(["GENERATED", "EDITED", "SCHEDULED", "PUBLISHED"]).optional(),
  }),
});

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
    const status = searchParams.get("status");
    const videoId = searchParams.get("videoId");
    const sortBy = searchParams.get("sortBy") || "viralityScore";

    const clips = await prisma.clip.findMany({
      where: {
        userId: session.user.id,
        ...(status && { status: status as "GENERATED" | "EDITED" | "SCHEDULED" | "PUBLISHED" }),
        ...(videoId && { videoId }),
      },
      orderBy: sortBy === "views" 
        ? { metadata: 'desc' }
        : { viralityScore: "desc" },
      include: {
        video: {
          select: { title: true },
        },
        _count: {
          select: { scheduledPosts: true },
        },
      },
    });

    const response = NextResponse.json({
      clips: clips.map(c => ({
        id: c.id,
        title: c.title,
        duration: c.duration,
        status: c.status,
        viralityScore: c.viralityScore,
        thumbnailUrl: c.thumbnailUrl,
        videoTitle: c.video.title,
        scheduledCount: c._count.scheduledPosts,
        createdAt: c.createdAt.toISOString(),
      })),
    });
    
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    return response;
  } catch (error) {
    console.error("Fetch clips error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Rate limiting
    const { success, remaining, reset } = await updateLimiter(req);
    if (!success) {
      return rateLimitResponse(reset);
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { clipId, updates } = updateClipSchema.parse(body);

    // Verify ownership
    const existingClip = await prisma.clip.findFirst({
      where: { id: clipId, userId: session.user.id },
    });

    if (!existingClip) {
      return NextResponse.json({ error: "Clip not found" }, { status: 404 });
    }

    const updatedClip = await prisma.clip.update({
      where: { id: clipId },
      data: updates,
    });

    const response = NextResponse.json({
      clip: {
        id: updatedClip.id,
        title: updatedClip.title,
        status: updatedClip.status,
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
    console.error("Update clip error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
