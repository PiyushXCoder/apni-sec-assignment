import { UserRepository } from "@/core/repositories/UserRepository";
import { RefreshTokenRepository } from "@/core/repositories/RefreshTokenRepository";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/core/services/AuthService";
import { AuthController } from "@/core/controllers/AuthController";

export async function POST(req: NextRequest) {
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

    const result = await controller.login(email, password, userAgent, ip);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 },
    );
  }
}
