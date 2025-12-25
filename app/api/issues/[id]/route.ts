import { IssueRepository } from "@/core/repositories/IssueRepository";
import { IssueService } from "@/core/services/IssueService";
import { IssueController } from "@/core/controllers/IssueController";
import { UserRepository } from "@/core/repositories/UserRepository";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decodeJWT } from "@/core/utils/jwtUtils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - No access token provided" },
        { status: 401 }
      );
    }

    let email: string;
    try {
      const decoded = decodeJWT(accessToken);
      email = decoded.email;
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const userRepository = new UserRepository(prisma);
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const issueRepository = new IssueRepository(prisma);
    const issueService = new IssueService(issueRepository);
    const issueController = new IssueController(issueService);

    const issue = await issueController.getIssueById(id, user.id);

    return NextResponse.json(issue, { status: 200 });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const status = errorMessage.includes("not found") || errorMessage.includes("Unauthorized")
      ? 404
      : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - No access token provided" },
        { status: 401 }
      );
    }

    let email: string;
    try {
      const decoded = decodeJWT(accessToken);
      email = decoded.email;
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const userRepository = new UserRepository(prisma);
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { type, title, description, priority, status } = body;

    const issueRepository = new IssueRepository(prisma);
    const issueService = new IssueService(issueRepository);
    const issueController = new IssueController(issueService);

    const issue = await issueController.updateIssue(id, user.id, {
      type,
      title,
      description,
      priority,
      status,
    });

    return NextResponse.json(issue, { status: 200 });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const status =
      errorMessage.includes("not found") || errorMessage.includes("Unauthorized")
        ? 404
        : errorMessage.includes("required") || errorMessage.includes("Invalid") || errorMessage.includes("empty")
        ? 400
        : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - No access token provided" },
        { status: 401 }
      );
    }

    let email: string;
    try {
      const decoded = decodeJWT(accessToken);
      email = decoded.email;
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const userRepository = new UserRepository(prisma);
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const issueRepository = new IssueRepository(prisma);
    const issueService = new IssueService(issueRepository);
    const issueController = new IssueController(issueService);

    await issueController.deleteIssue(id, user.id);

    return NextResponse.json({ message: "Issue deleted successfully" }, { status: 200 });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const status = errorMessage.includes("not found") || errorMessage.includes("Unauthorized")
      ? 404
      : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
