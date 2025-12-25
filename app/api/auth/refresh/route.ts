import { UserRepository } from "@/core/repositories/UserRepository";
import { RefreshTokenRepository } from "@/core/repositories/RefreshTokenRepository";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/core/services/AuthService";
import { AuthController } from "@/core/controllers/AuthController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token is required" },
        { status: 400 },
      );
    }

    const userRepository = new UserRepository(prisma);
    const refreshTokenRepository = new RefreshTokenRepository(prisma);
    const service = new AuthService(userRepository, refreshTokenRepository);
    const controller = new AuthController(service);

    const result = await controller.refreshToken(refreshToken);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 },
    );
  }
}
