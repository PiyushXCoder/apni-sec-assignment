import { decodeJWT } from "../utils/jwtUtils";

export class MiddlewareAuthService {
  private publicPaths: string[];

  constructor(publicPaths: string[] = []) {
    this.publicPaths = publicPaths;
  }

  isPublicPath(pathname: string): boolean {
    return this.publicPaths.some((path) => pathname.startsWith(path));
  }

  validateAccessToken(token: string | undefined) {
    if (!token) {
      return { isValid: false, requiresRefresh: true };
    }

    try {
      decodeJWT(token);
      return { isValid: true, requiresRefresh: false };
    } catch (error) {
      return { isValid: false, requiresRefresh: true, error: error };
    }
  }

  async refreshAccessToken(refreshToken: string, refreshUrl: string) {
    try {
      const response = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  }
}
