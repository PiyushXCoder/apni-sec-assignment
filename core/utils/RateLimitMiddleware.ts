import { NextRequest, NextResponse } from "next/server";
import { globalRateLimiter } from "./RateLimiter";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  response?: NextResponse;
}

/**
 * Apply rate limiting to a request
 * Returns a result object with rate limit info and optional error response
 */
export function applyRateLimit(req: NextRequest, endpoint?: string): RateLimitResult {
  // Get identifier (IP address or user ID from token)
  const ip = req.headers.get("x-forwarded-for") || 
             req.headers.get("x-real-ip") || 
             "unknown";
  
  // Extract first IP if multiple are present
  const identifier = ip.split(",")[0].trim();

  // Check rate limit
  const { allowed, limit, remaining, reset } = globalRateLimiter.checkLimit(
    identifier,
    endpoint
  );

  if (!allowed) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    
    const response = NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        retryAfter: retryAfter,
      },
      { status: 429 }
    );

    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", "0");
    response.headers.set("X-RateLimit-Reset", Math.floor(reset / 1000).toString());
    response.headers.set("Retry-After", retryAfter.toString());

    return {
      success: false,
      limit,
      remaining: 0,
      reset,
      response,
    };
  }

  // Rate limit not exceeded
  return {
    success: true,
    limit,
    remaining,
    reset,
  };
}

/**
 * Add rate limit headers to a response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  limit: number,
  remaining: number,
  reset: number
): NextResponse {
  response.headers.set("X-RateLimit-Limit", limit.toString());
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set("X-RateLimit-Reset", Math.floor(reset / 1000).toString());
  return response;
}
