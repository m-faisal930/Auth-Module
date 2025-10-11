import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { validatePassword } from "@/utils/validatePassword";
import { verifyToken } from "@/utils/verifyToken";
import {
  createSuccessResponse,
  createErrorResponse,
  createUnauthorizedResponse,
  createNotFoundResponse,
  createServerErrorResponse,
} from "@/utils/apiResponse";

export async function PUT(req: Request) {
  try {
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return createErrorResponse("Old and new passwords are required", 400);
    }

    if (oldPassword.length < 6) {
      return createErrorResponse("Old password must be at least 6 characters long", 400);
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return createErrorResponse(passwordError, 400);
    }

    if (oldPassword === newPassword) {
      return createErrorResponse("New password cannot be the same as the old password", 400);
    }

    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader?.split("token=")[1]?.split(";")[0];

    const { payload, tokenError, status } = verifyToken(token);

    if (tokenError) {
      return createErrorResponse(tokenError, status || 401);
    }

    if (!payload) {
      return createUnauthorizedResponse("Token verification failed");
    }

    await connectDB();

    const user = await User.findById(payload.id);
    if (!user) {
      return createNotFoundResponse("User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return createUnauthorizedResponse("Old password is incorrect");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    const response = createSuccessResponse("Password changed successfully");
    response.cookies.set("token", "", { maxAge: 0 });
    return response;
  } catch (err) {
    return createServerErrorResponse("Failed to change password", err);
  }
}
