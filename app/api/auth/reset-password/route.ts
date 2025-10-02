import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connectDB } from "@/lib/mongoose";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { token, password } = await req.json();
        interface MyJwtPayload {
            id: string;
            email: string;
            iat: number;
            exp: number;
        }
        let decoded = new Object() as MyJwtPayload;

        decoded  = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;


        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: "Password reset successful" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }
}
