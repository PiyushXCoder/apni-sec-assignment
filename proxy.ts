import { NextRequest, NextResponse } from "next/server";
import { MiddlewareAuthService } from "@/core/services/MiddlewareAuthService";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/favicon.ico",
  "/_next",
  "/public",
];

const authService = new MiddlewareAuthService(PUBLIC_PATHS);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (authService.isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const validation = authService.validateAccessToken(accessToken);

  if (validation.isValid) {
    return NextResponse.next();
  }

  if (validation.requiresRefresh && refreshToken) {
    const refreshUrl = new URL("/api/auth/refresh", request.url).toString();
    const tokens = await authService.refreshAccessToken(
      refreshToken,
      refreshUrl,
    );

    if (tokens) {
      const response = NextResponse.next();
      response.cookies.set("accessToken", tokens.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60,
      });
      response.cookies.set("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }
  }

  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
