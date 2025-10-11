import { NextResponse } from "next/server";

// Standard API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: string[];
}

// Success response helper
export function createSuccessResponse<T = any>(
  message: string,
  data?: T,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

// Error response helper
export function createErrorResponse(
  message: string,
  status: number = 400,
  errors?: string[]
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      error: message,
      errors,
    },
    { status }
  );
}

// Validation error response helper
export function createValidationErrorResponse(
  errors: string[],
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message: "Validation failed",
      error: "Validation failed",
      errors,
    },
    { status }
  );
}

// Internal server error response helper
export function createServerErrorResponse(
  message: string = "Internal server error",
  error?: any
): NextResponse<ApiResponse> {
  // Log the actual error for debugging
  if (error) {
    console.error("Server Error:", error);
  }
  
  return NextResponse.json(
    {
      success: false,
      message,
      error: message,
    },
    { status: 500 }
  );
}

// Unauthorized response helper
export function createUnauthorizedResponse(
  message: string = "Unauthorized"
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      error: message,
    },
    { status: 401 }
  );
}

// Not found response helper
export function createNotFoundResponse(
  message: string = "Resource not found"
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      error: message,
    },
    { status: 404 }
  );
}