import { UserRepository } from "@/core/repositories/UserRepository";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decodeJWT } from "@/core/utils/jwtUtils";
import { hashPassword } from "@/core/utils/PasswordUtils";

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

export async function PUT(req: NextRequest) {
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

    const body = await req.json();
    const { email: newEmail, password } = body;

    if (!newEmail && !password) {
      return NextResponse.json(
        { error: "At least one field (email or password) is required" },
        { status: 400 },
      );
    }

    const updateData: { email?: string; passwordHash?: string } = {};

    if (newEmail) {
      if (newEmail !== user.email) {
        const existingUser = await userRepository.findByEmail(newEmail);
        if (existingUser) {
          return NextResponse.json(
            { error: "Email already in use" },
            { status: 400 },
          );
        }
      }
      updateData.email = newEmail;
    }

    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters long" },
          { status: 400 },
        );
      }
      updateData.passwordHash = await hashPassword(password);
    }

    const updatedUser = await userRepository.updateUser(user.id, updateData);

    return NextResponse.json(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        emailVerifiedAt: updatedUser.emailVerifiedAt,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
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
