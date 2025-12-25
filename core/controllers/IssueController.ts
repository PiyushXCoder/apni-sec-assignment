import { IssueService } from "../services/IssueService";
import { IssueType, IssuePriority, IssueStatus } from "../types/entities";

export class IssueController {
  constructor(private issueService: IssueService) {}

  async createIssue(
    userId: string,
    data: {
      type: IssueType;
      title: string;
      description: string;
      priority?: IssuePriority;
      status?: IssueStatus;
    }
  ) {
    return this.issueService.createIssue(userId, data);
  }

  async getIssueById(id: string, userId: string) {
    return this.issueService.getIssueById(id, userId);
  }

  async listIssues(userId: string, type?: string) {
    return this.issueService.listIssues(userId, type);
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
  ) {
    return this.issueService.updateIssue(id, userId, data);
  }

  async deleteIssue(id: string, userId: string) {
    return this.issueService.deleteIssue(id, userId);
  }
}
