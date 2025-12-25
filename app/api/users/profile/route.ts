import { UserRepository } from "@/core/repositories/UserRepository";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decodeJWT } from "@/core/utils/jwtUtils";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - No access token provided" },
        { status: 401 },
      );
    }

    let email: string;
    try {
      const decoded = decodeJWT(accessToken);
      email = decoded.email;
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token: " + (error as Error).message },
        { status: 401 },
      );
    }

    const userRepository = new UserRepository(prisma);
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
