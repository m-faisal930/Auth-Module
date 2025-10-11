import { createSuccessResponse } from "@/utils/apiResponse";

export async function POST() {
  const response = createSuccessResponse("Logged out successfully");
  response.cookies.set("token", "", { maxAge: 0 });
  return response;
}
