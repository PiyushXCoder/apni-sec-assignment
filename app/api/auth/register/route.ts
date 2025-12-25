import { UserRepository } from "@/core/repositories/UserRepository";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/core/services/AuthService";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const repo = new UserRepository(prisma);
    const service = new AuthService(repo);
    const user = await service.register(email, password);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
