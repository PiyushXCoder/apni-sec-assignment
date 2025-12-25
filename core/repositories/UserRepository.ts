import { PrismaClient } from "@/lib/generated/prisma/client";
import { User, UserWithPassword } from "../types/entities";

export class UserRepository {
  constructor(private prisma: PrismaClient) { }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
  }

  private validatePassword(password: string): void {
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
  }

  async createUser(data: {
    email: string;
    passwordHash: string;
  }): Promise<User> {
    this.validateEmail(data.email);
    
    return await this.prisma.user.create({ data }).then((userPrisma) => {
      const user: User = {
        id: userPrisma.id,
        email: userPrisma.email,
        emailVerifiedAt: userPrisma.emailVerifiedAt,
        createdAt: userPrisma.createdAt,
        updatedAt: userPrisma.updatedAt,
      };
      return user;
    });
  }

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    return this.prisma.user
      .findUnique({ where: { email } })
      .then((userPrisma) => {
        if (!userPrisma) return null;
        const user: UserWithPassword = {
          id: userPrisma.id,
          email: userPrisma.email,
          emailVerifiedAt: userPrisma.emailVerifiedAt,
          createdAt: userPrisma.createdAt,
          updatedAt: userPrisma.updatedAt,
          passwordHash: userPrisma.passwordHash,
        };
        return user;
      });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } }).then((userPrisma) => {
      if (!userPrisma) return null;
      const user: User = {
        id: userPrisma.id,
        email: userPrisma.email,
        emailVerifiedAt: userPrisma.emailVerifiedAt,
        createdAt: userPrisma.createdAt,
        updatedAt: userPrisma.updatedAt,
      };
      return user;
    });
  }
}
