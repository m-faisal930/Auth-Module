import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export interface MyJwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export function verifyToken(token: string | undefined) {
  if (!token) {
    return { tokenError: "Token missing", status: 401 };
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;
    return { payload, tokenError: null };
  } catch {
    return { tokenError: "Invalid token", status: 401 };
  }
}
