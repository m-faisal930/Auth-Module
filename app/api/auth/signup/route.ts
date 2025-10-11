import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { validatePassword } from "@/utils/validatePassword";
import {
  createSuccessResponse,
  createErrorResponse,
  createServerErrorResponse,
} from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return createErrorResponse("All fields are required", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createErrorResponse("Invalid email format", 400);
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return createErrorResponse(
        "Username must be 3-20 characters and contain only letters, numbers, or underscores",
        400
      );
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return createErrorResponse(passwordError, 400);
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return createErrorResponse("Email already exists", 400);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      password: hashed,
    });

    return createSuccessResponse(
      "User created successfully", 
      { userId: user._id },
      201
    );
  } catch (error) {
    return createServerErrorResponse("Failed to create user", error);
  }
}
