import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader?.split("token=")[1]?.split(";")[0];

  if (!token) return NextResponse.json({ user: null });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return NextResponse.json({ user: { id: decoded.id, email: decoded.email } });
  } catch {
    return NextResponse.json({ user: null });
  }
}
