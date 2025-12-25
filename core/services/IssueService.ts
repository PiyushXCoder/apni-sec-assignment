import { IssueRepository } from "../repositories/IssueRepository";
import {
  Issue,
  IssueType,
  IssuePriority,
  IssueStatus,
} from "../types/entities";

export class IssueService {
  constructor(private issueRepository: IssueRepository) {}

  async createIssue(
    userId: string,
    data: {
      type: IssueType;
      title: string;
      description: string;
      priority?: IssuePriority;
      status?: IssueStatus;
    }
  ): Promise<Issue> {
    if (!data.type || !data.title || !data.description) {
      throw new Error("Type, title, and description are required");
    }

    if (!data.title.trim()) {
      throw new Error("Title cannot be empty");
    }

    if (!data.description.trim()) {
      throw new Error("Description cannot be empty");
    }

    if (
      !Object.values(IssueType).includes(data.type)
    ) {
      throw new Error("Invalid issue type");
    }

    if (
      data.priority &&
      !Object.values(IssuePriority).includes(data.priority)
    ) {
      throw new Error("Invalid priority");
    }

    if (
      data.status &&
      !Object.values(IssueStatus).includes(data.status)
    ) {
      throw new Error("Invalid status");
    }

    return await this.issueRepository.createIssue({
      userId,
      type: data.type,
      title: data.title.trim(),
      description: data.description.trim(),
      priority: data.priority || IssuePriority.MEDIUM,
      status: data.status || IssueStatus.OPEN,
    });
  }

  async getIssueById(id: string, userId: string): Promise<Issue> {
    const issue = await this.issueRepository.findById(id);

    if (!issue) {
      throw new Error("Issue not found");
    }

    if (issue.userId !== userId) {
      throw new Error("Unauthorized to access this issue");
    }

    return issue;
  }

  async listIssues(userId: string, type?: string): Promise<Issue[]> {
    let issueType: IssueType | undefined;

    if (type) {
      const typeUpper = type.toUpperCase().replace(/-/g, "_");
      if (Object.values(IssueType).includes(typeUpper as IssueType)) {
        issueType = typeUpper as IssueType;
      } else {
        throw new Error("Invalid issue type");
      }
    }

    return await this.issueRepository.findByUserId(userId, issueType);
  }

  async updateIssue(
    id: string,
    userId: string,
    data: {
      type?: IssueType;
      title?: string;
      description?: string;
      priority?: IssuePriority;
      status?: IssueStatus;
    }
  ): Promise<Issue> {
    const isOwner = await this.issueRepository.isIssueOwnedByUser(id, userId);

    if (!isOwner) {
      throw new Error("Issue not found or unauthorized");
    }

    if (Object.keys(data).length === 0) {
      throw new Error("At least one field is required for update");
    }

    if (data.title !== undefined && !data.title.trim()) {
      throw new Error("Title cannot be empty");
    }

    if (data.description !== undefined && !data.description.trim()) {
      throw new Error("Description cannot be empty");
    }

    if (data.type && !Object.values(IssueType).includes(data.type)) {
      throw new Error("Invalid issue type");
    }

    if (
      data.priority &&
      !Object.values(IssuePriority).includes(data.priority)
    ) {
      throw new Error("Invalid priority");
    }

    if (data.status && !Object.values(IssueStatus).includes(data.status)) {
      throw new Error("Invalid status");
    }

    const updateData: any = {};
    if (data.type) updateData.type = data.type;
    if (data.title) updateData.title = data.title.trim();
    if (data.description) updateData.description = data.description.trim();
    if (data.priority) updateData.priority = data.priority;
    if (data.status) updateData.status = data.status;

    return await this.issueRepository.updateIssue(id, updateData);
  }

  async deleteIssue(id: string, userId: string): Promise<void> {
    const isOwner = await this.issueRepository.isIssueOwnedByUser(id, userId);

    if (!isOwner) {
      throw new Error("Issue not found or unauthorized");
    }

    await this.issueRepository.deleteIssue(id);
  }
}
