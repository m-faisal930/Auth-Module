import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { validatePassword } from "@/utils/validatePassword";
import { verifyToken } from "@/utils/verifyToken";

export async function PUT(req: Request) {
  try {
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Old and new passwords are required" },
        { status: 400 }
      );
    }

    if (oldPassword.length < 6) {
      return NextResponse.json(
        { error: "Old password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const error = validatePassword(newPassword);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    if (oldPassword === newPassword) {
      return NextResponse.json(
        { error: "New password cannot be the same as the old password" },
        { status: 400 }
      );
    }

    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader?.split("token=")[1]?.split(";")[0];

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

    await connectDB();

    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Old password is incorrect" },
        { status: 401 }
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    const response = NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
    response.cookies.set("token", "", { maxAge: 0 });
    return response;
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
