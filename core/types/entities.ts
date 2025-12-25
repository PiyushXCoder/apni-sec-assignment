export interface User {
  id: string;
  email: string;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}

export interface UserAuthData {
  id: string;
  email: string;
  passwordHash: string;
}

export interface UserProfile {
  email: string;
}

export interface RefreshToken {
  id: string;
  tokenHash: string;
  userAgent: string | null;
  ip: string | null;
  createdAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  userId: string;
}

export enum IssueType {
  CLOUD_SECURITY = "CLOUD_SECURITY",
  RETEAM_ASSESSMENT = "RETEAM_ASSESSMENT",
  VAPT = "VAPT",
}

export enum IssuePriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum IssueStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export interface Issue {
  id: string;
  type: IssueType;
  title: string;
  description: string;
  priority: IssuePriority;
  status: IssueStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIssueData {
  type: IssueType;
  title: string;
  description: string;
  priority?: IssuePriority;
  status?: IssueStatus;
  userId: string;
}

export interface UpdateIssueData {
  type?: IssueType;
  title?: string;
  description?: string;
  priority?: IssuePriority;
  status?: IssueStatus;
}

