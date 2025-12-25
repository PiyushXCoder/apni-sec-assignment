import { UserRepository } from "@/core/repositories/UserRepository";
import { RefreshTokenRepository } from "@/core/repositories/RefreshTokenRepository";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/core/services/AuthService";
import { AuthController } from "@/core/controllers/AuthController";
import { applyRateLimit, addRateLimitHeaders } from "@/core/utils/RateLimitMiddleware";

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = applyRateLimit(req, "/api/auth/login");
  if (!rateLimitResult.success) {
    return rateLimitResult.response!;
  }

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const userAgent = req.headers.get("user-agent") || "unknown";
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const userRepository = new UserRepository(prisma);
    const refreshTokenRepository = new RefreshTokenRepository(prisma);
    const service = new AuthService(userRepository, refreshTokenRepository);
    const controller = new AuthController(service);

    const tokens = await controller.login(email, password, userAgent, ip);

    const response = NextResponse.json(tokens, { status: 200 });
    
    // Add rate limit headers
    addRateLimitHeaders(response, rateLimitResult.limit, rateLimitResult.remaining, rateLimitResult.reset);
    
    response.cookies.set("accessToken", tokens.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
    });
    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 },
    );
  }
}
