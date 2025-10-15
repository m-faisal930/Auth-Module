import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createSuccessResponse,
  createErrorResponse,
  createUnauthorizedResponse,
  createServerErrorResponse,
} from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return createErrorResponse("Email and password required", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createErrorResponse("Invalid email format", 400);
    }

    if (password.length < 6) {
      return createErrorResponse("Password must be at least 6 characters long", 400);
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return createUnauthorizedResponse("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return createUnauthorizedResponse("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    const userData = { 
      id: user._id, 
      email: user.email, 
      username: user.username 
    };

    const response = createSuccessResponse("Login successful", { user: userData });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (err) {
    return createServerErrorResponse("Login failed", err);
  }
}
