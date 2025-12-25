import { PrismaClient } from "@/lib/generated/prisma/client";
import {
  Issue,
  CreateIssueData,
  UpdateIssueData,
  IssueType,
} from "../types/entities";

export class IssueRepository {
  constructor(private prisma: PrismaClient) {}

  async createIssue(data: CreateIssueData): Promise<Issue> {
    return await this.prisma.issue
      .create({
        data: {
          type: data.type,
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          userId: data.userId,
        },
      })
      .then((issuePrisma) => {
        const issue: Issue = {
          id: issuePrisma.id,
          type: issuePrisma.type as IssueType,
          title: issuePrisma.title,
          description: issuePrisma.description,
          priority: issuePrisma.priority as any,
          status: issuePrisma.status as any,
          userId: issuePrisma.userId,
          createdAt: issuePrisma.createdAt,
          updatedAt: issuePrisma.updatedAt,
        };
        return issue;
      });
  }

  async findById(id: string): Promise<Issue | null> {
    return this.prisma.issue
      .findUnique({ where: { id } })
      .then((issuePrisma) => {
        if (!issuePrisma) return null;
        const issue: Issue = {
          id: issuePrisma.id,
          type: issuePrisma.type as IssueType,
          title: issuePrisma.title,
          description: issuePrisma.description,
          priority: issuePrisma.priority as any,
          status: issuePrisma.status as any,
          userId: issuePrisma.userId,
          createdAt: issuePrisma.createdAt,
          updatedAt: issuePrisma.updatedAt,
        };
        return issue;
      });
  }

  async findByUserId(
    userId: string,
    type?: IssueType
  ): Promise<Issue[]> {
    const where: any = { userId };
    if (type) {
      where.type = type;
    }

    return this.prisma.issue.findMany({ where, orderBy: { createdAt: "desc" } }).then((issuesPrisma) =>
      issuesPrisma.map((issuePrisma) => ({
        id: issuePrisma.id,
        type: issuePrisma.type as IssueType,
        title: issuePrisma.title,
        description: issuePrisma.description,
        priority: issuePrisma.priority as any,
        status: issuePrisma.status as any,
        userId: issuePrisma.userId,
        createdAt: issuePrisma.createdAt,
        updatedAt: issuePrisma.updatedAt,
      }))
    );
  }

  async updateIssue(id: string, data: UpdateIssueData): Promise<Issue> {
    return this.prisma.issue
      .update({
        where: { id },
        data,
      })
      .then((issuePrisma) => ({
        id: issuePrisma.id,
        type: issuePrisma.type as IssueType,
        title: issuePrisma.title,
        description: issuePrisma.description,
        priority: issuePrisma.priority as any,
        status: issuePrisma.status as any,
        userId: issuePrisma.userId,
        createdAt: issuePrisma.createdAt,
        updatedAt: issuePrisma.updatedAt,
      }));
  }

  async deleteIssue(id: string): Promise<void> {
    await this.prisma.issue.delete({ where: { id } });
  }

  async isIssueOwnedByUser(id: string, userId: string): Promise<boolean> {
    const issue = await this.prisma.issue.findFirst({
      where: { id, userId },
    });
    return !!issue;
  }
}
