import { UserRepository } from "@/core/repositories/UserRepository";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/core/services/AuthService";
import { AuthController } from "@/core/controllers/AuthController";
import { RefreshTokenRepository } from "@/core/repositories/RefreshTokenRepository";
import { applyRateLimit, addRateLimitHeaders } from "@/core/utils/RateLimitMiddleware";

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = applyRateLimit(req, "/api/auth/register");
  if (!rateLimitResult.success) {
    return rateLimitResult.response!;
  }

  const { email, password } = await req.json();

  try {
    const userRepository = new UserRepository(prisma);
    const refreshTokenRepository = new RefreshTokenRepository(prisma);
    const service = new AuthService(userRepository, refreshTokenRepository);
    const controller = new AuthController(service);
    const user = await controller.register(email, password);

    const response = NextResponse.json(user, { status: 201 });
    
    // Add rate limit headers
    addRateLimitHeaders(response, rateLimitResult.limit, rateLimitResult.remaining, rateLimitResult.reset);
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
