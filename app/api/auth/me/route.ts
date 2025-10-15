import jwt from "jsonwebtoken";
import { apiResponse } from "../../../../utils/apiResponse";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader?.split("token=")[1]?.split(";")[0];

  if (!token)
    return apiResponse({
      success: true,
      message: "User not authenticated",
      data: { user: null },
    });

  interface MyJwtPayload {
    id: string;
    email: string;
    iat: number;
    exp: number;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;
    return apiResponse({
      success: true,
      message: "User authenticated",
      data: { user: { id: decoded.id, email: decoded.email } },
    });
  } catch {
    return apiResponse({
      success: true,
      message: "Invalid token",
      data: { user: null },
    });
  }
}
