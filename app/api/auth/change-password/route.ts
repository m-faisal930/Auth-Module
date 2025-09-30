import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function PUT(req: Request) {
  try {
    const { oldPassword, newPassword } = await req.json();
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header missing" }, { status: 401 });
    }
    console.log(authHeader);

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 401 });
    }
interface MyJwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}
let payload = new Object() as MyJwtPayload;
    try {
       payload = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: "Old and new passwords are required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Old password is incorrect" }, { status: 401 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });


  } catch (err) {
    return NextResponse.json({ error:  err }, { status: 500 });
  }
}   
