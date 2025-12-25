import { PrismaClient } from "@/lib/generated/prisma/client";
import { RefreshToken } from "../types/entities";

export class RefreshTokenRepository {
  constructor(private prisma: PrismaClient) { }

  async createRefreshToken(data: {
    tokenHash: string;
    userId: string;
    userAgent?: string | null;
    ip?: string | null;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    return await this.prisma.refreshToken.create({ data }).then((tokenPrisma) => {
      const token: RefreshToken = {
        id: tokenPrisma.id,
        tokenHash: tokenPrisma.tokenHash,
        userAgent: tokenPrisma.userAgent,
        ip: tokenPrisma.ip,
        createdAt: tokenPrisma.createdAt,
        expiresAt: tokenPrisma.expiresAt,
        revokedAt: tokenPrisma.revokedAt,
        userId: tokenPrisma.userId,
      };
      return token;
    });
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken
      .findFirst({ where: { tokenHash } })
      .then((tokenPrisma) => {
        if (!tokenPrisma) return null;
        const token: RefreshToken = {
          id: tokenPrisma.id,
          tokenHash: tokenPrisma.tokenHash,
          userAgent: tokenPrisma.userAgent,
          ip: tokenPrisma.ip,
          createdAt: tokenPrisma.createdAt,
          expiresAt: tokenPrisma.expiresAt,
          revokedAt: tokenPrisma.revokedAt,
          userId: tokenPrisma.userId,
        };
        return token;
      });
  }

  async findById(id: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken
      .findUnique({ where: { id } })
      .then((tokenPrisma) => {
        if (!tokenPrisma) return null;
        const token: RefreshToken = {
          id: tokenPrisma.id,
          tokenHash: tokenPrisma.tokenHash,
          userAgent: tokenPrisma.userAgent,
          ip: tokenPrisma.ip,
          createdAt: tokenPrisma.createdAt,
          expiresAt: tokenPrisma.expiresAt,
          revokedAt: tokenPrisma.revokedAt,
          userId: tokenPrisma.userId,
        };
        return token;
      });
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    return this.prisma.refreshToken
      .findMany({ where: { userId } })
      .then((tokensPrisma) =>
        tokensPrisma.map((tokenPrisma) => ({
          id: tokenPrisma.id,
          tokenHash: tokenPrisma.tokenHash,
          userAgent: tokenPrisma.userAgent,
          ip: tokenPrisma.ip,
          createdAt: tokenPrisma.createdAt,
          expiresAt: tokenPrisma.expiresAt,
          revokedAt: tokenPrisma.revokedAt,
          userId: tokenPrisma.userId,
        }))
      );
  }

  async revokeToken(id: string): Promise<RefreshToken> {
    return this.prisma.refreshToken
      .update({
        where: { id },
        data: { revokedAt: new Date() },
      })
      .then((tokenPrisma) => ({
        id: tokenPrisma.id,
        tokenHash: tokenPrisma.tokenHash,
        userAgent: tokenPrisma.userAgent,
        ip: tokenPrisma.ip,
        createdAt: tokenPrisma.createdAt,
        expiresAt: tokenPrisma.expiresAt,
        revokedAt: tokenPrisma.revokedAt,
        userId: tokenPrisma.userId,
      }));
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async deleteToken(id: string): Promise<void> {
    await this.prisma.refreshToken.delete({ where: { id } });
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
