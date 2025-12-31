import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
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
        ? { metadata: 'desc' } // Would need to extract views from metadata
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

    return NextResponse.json({ clips });
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { clipId, updates } = body;

    if (!clipId) {
      return NextResponse.json({ error: "Clip ID is required" }, { status: 400 });
    }

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

    return NextResponse.json({ clip: updatedClip });
  } catch (error) {
    console.error("Update clip error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
