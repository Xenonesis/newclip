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
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Return generic message to prevent user enumeration
      return NextResponse.json(
        { error: "Unable to create account. Please try a different email." },
        { status: 400 }
      );
    }

    // Hash password with strong cost factor
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email,
        password: hashedPassword,
        plan: "free",
      },
    });

    return NextResponse.json(
      { 
        message: "Account created successfully",
        user: { id: user.id, email: user.email, name: user.name }
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
