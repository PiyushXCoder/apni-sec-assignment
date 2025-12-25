import { UserRepository } from "@/core/repositories/UserRepository";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/core/services/AuthService";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get("email") || "";
  const password = searchParams.get("password") || "";

  try {
    const repo = new UserRepository(prisma);
    const service = new AuthService(repo);
    const token = await service.login(email, password);

    return NextResponse.json(token, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
