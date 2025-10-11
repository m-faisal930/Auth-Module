import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createSuccessResponse } from "@/utils/apiResponse";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader?.split("token=")[1]?.split(";")[0];

  if (!token) return createSuccessResponse("User not authenticated", { user: null });

  interface MyJwtPayload {
    id: string;
    email: string;
    iat: number;
    exp: number;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;
    return createSuccessResponse("User authenticated", {
      user: { id: decoded.id, email: decoded.email },
    });
  } catch {
    return createSuccessResponse("Invalid token", { user: null });
  }
}
