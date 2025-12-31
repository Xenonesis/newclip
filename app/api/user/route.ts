import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { z } from "zod";

const fetchLimiter = rateLimit({ interval: 60 * 1000, limit: 30 });
const updateLimiter = rateLimit({ interval: 60 * 1000, limit: 10 });

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  image: z.string().url("Invalid image URL").optional(),
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        createdAt: true,
        _count: {
          select: {
            videos: true,
            clips: true,
            scheduledPosts: true,
            socialAccounts: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        plan: user.plan,
        createdAt: user.createdAt.toISOString(),
        stats: {
          videos: user._count.videos,
          clips: user._count.clips,
          scheduledPosts: user._count.scheduledPosts,
          socialAccounts: user._count.socialAccounts,
        },
      },
    });
    
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    return response;
  } catch (error) {
    console.error("Fetch user error:", error);
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
    const updates = updateUserSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updates,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    const response = NextResponse.json({ user });
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Validation error" },
        { status: 400 }
      );
    }
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
