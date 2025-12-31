import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Stricter rate limit for registration to prevent abuse
const registerLimiter = rateLimit({ interval: 60 * 60 * 1000, limit: 5 }); // 5 per hour

const registerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email too long")
    .toLowerCase(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - stricter for registration
    const { success, reset } = await registerLimiter(req);
    if (!success) {
      return rateLimitResponse(reset, "Too many registration attempts. Please try again later.");
    }

    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    // Check if user exists
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbError) {
      console.error("Database connection error during user lookup:", dbError);
      return NextResponse.json(
        { error: "Database connection error. Please try again." },
        { status: 503 }
      );
    }

    if (existingUser) {
      // Return specific message for existing user
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    // Hash password with strong cost factor
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    let user;
    try {
      user = await prisma.user.create({
        data: {
          name: name.trim(),
          email,
          password: hashedPassword,
          plan: "free",
        },
      });
    } catch (createError) {
      console.error("Error creating user:", createError);
      // Check for unique constraint violation (race condition)
      if ((createError as { code?: string }).code === 'P2002') {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in instead." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create account. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "Account created successfully",
        user: { id: user.id, email: user.email, name: user.name }
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Validation error" },
        { status: 400 }
      );
    }
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
