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
