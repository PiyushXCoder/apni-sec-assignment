import { IssueRepository } from "@/core/repositories/IssueRepository";
import { IssueService } from "@/core/services/IssueService";
import { IssueController } from "@/core/controllers/IssueController";
import { UserRepository } from "@/core/repositories/UserRepository";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decodeJWT } from "@/core/utils/jwtUtils";
import { applyRateLimit, addRateLimitHeaders } from "@/core/utils/RateLimitMiddleware";

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = applyRateLimit(req, "/api/issues");
  if (!rateLimitResult.success) {
    return rateLimitResult.response!;
  }

  try {
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

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const issues = await issueController.listIssues(
      user.id,
      type || undefined
    );

    const response = NextResponse.json(issues, { status: 200 });
    
    // Add rate limit headers
    addRateLimitHeaders(response, rateLimitResult.limit, rateLimitResult.remaining, rateLimitResult.reset);
    
    return response;
  } catch (error) {
    const errorMessage = (error as Error).message;
    const status = errorMessage.includes("Invalid") ? 400 : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = applyRateLimit(req, "/api/issues");
  if (!rateLimitResult.success) {
    return rateLimitResult.response!;
  }

  try {
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

    const issue = await issueController.createIssue(user.id, {
      type,
      title,
      description,
      priority,
      status,
    });

    const response = NextResponse.json(issue, { status: 201 });
    
    // Add rate limit headers
    addRateLimitHeaders(response, rateLimitResult.limit, rateLimitResult.remaining, rateLimitResult.reset);
    
    return response;
  } catch (error) {
    const errorMessage = (error as Error).message;
    const status = errorMessage.includes("required") || errorMessage.includes("Invalid") || errorMessage.includes("empty") ? 400 : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
