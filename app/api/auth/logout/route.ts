import { RefreshTokenRepository } from "@/core/repositories/RefreshTokenRepository";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashRefreshToken } from "@/core/utils/RefreshTokenUtils";

export async function POST(req: NextRequest) {
  try {
    const refreshToken =
      req.cookies.get("refreshToken")?.value ||
      (await req.json().then((body) => body.refreshToken));

    if (refreshToken) {
      const tokenHash = hashRefreshToken(refreshToken);
      const refreshTokenRepository = new RefreshTokenRepository(prisma);
      const storedToken =
        await refreshTokenRepository.findByTokenHash(tokenHash);

      if (storedToken) {
        await refreshTokenRepository.revokeToken(storedToken.id);
      }
    }

    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );

    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
