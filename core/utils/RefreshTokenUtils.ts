import crypto from "crypto";

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getRefreshTokenExpiration(days: number = 30): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt;
}

export function isRefreshTokenExpired(expiresAt: Date): boolean {
  return expiresAt < new Date();
}

export function isRefreshTokenRevoked(revokedAt: Date | null): boolean {
  return revokedAt !== null;
}
