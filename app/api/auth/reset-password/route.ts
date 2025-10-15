import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connectDB } from "@/lib/mongoose";
import { validatePassword } from "@/utils/validatePassword";
import { verifyToken } from "@/utils/verifyToken";
import {
  createSuccessResponse,
  createErrorResponse,
  createUnauthorizedResponse,
  createNotFoundResponse,
  createServerErrorResponse,
} from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token, password } = await req.json();

    if (!password || password.length < 6) {
      return createErrorResponse("Password must be at least 6 characters long", 400);
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return createErrorResponse(passwordError, 400);
    }

    const { payload, tokenError, status } = verifyToken(token);

    if (tokenError) {
      return createErrorResponse(tokenError, status || 401);
    }

    if (!payload) {
      return createUnauthorizedResponse("Token verification failed");
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return createNotFoundResponse("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return createSuccessResponse("Password reset successful");
  } catch (err) {
    return createServerErrorResponse("Failed to reset password", err);
  }
}
