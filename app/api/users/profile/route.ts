import { UserRepository } from "@/core/repositories/UserRepository";
import { UserService } from "@/core/services/UserService";
import { UserController } from "@/core/controllers/UserController";
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
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    const profile = await userController.getProfile(email);

    return NextResponse.json(profile, { status: 200 });
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

    const body = await req.json();
    const { email: newEmail, password } = body;

    const userRepository = new UserRepository(prisma);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    const updatedProfile = await userController.updateProfile(email, {
      email: newEmail,
      password,
    });

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const status = errorMessage.includes("required") || errorMessage.includes("already in use") ? 400 : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}

