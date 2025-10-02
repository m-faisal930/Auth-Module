
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User"; 
import { connectDB } from "@/lib/mongoose";
import { Resend } from 'resend';


export async function POST(req: Request) {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    try {
        await connectDB();
        const { email } = await req.json();


        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }


        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        );


        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: `${email}`,
            subject: 'Reset your password',
            html: `<strong>Click here to reset your password</strong> ${resetLink}`,
        });

        return NextResponse.json({ message: "Reset link sent to your email" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

