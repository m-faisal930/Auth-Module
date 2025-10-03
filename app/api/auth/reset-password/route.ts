import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connectDB } from "@/lib/mongoose";
import { validatePassword } from "@/utils/validatePassword";
import { verifyToken } from "@/utils/verifyToken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token, password } = await req.json();

    if (password.length < 6) {
      return NextResponse.json(
        { error: "password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const error = validatePassword(password);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const { payload, tokenError, status } = verifyToken(token);

    if (tokenError) {
      return NextResponse.json({ error: tokenError }, { status });
    }

    if (!payload) {
      return NextResponse.json(
        { error: "Token verification failed" },
        { status: 401 }
      );
    }
    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }
}
