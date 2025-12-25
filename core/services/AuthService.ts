import { RefreshTokenRepository } from "../repositories/RefreshTokenRepository";
import { UserRepository } from "../repositories/UserRepository";
import { encodeJWT } from "../utils/jwtUtils";
import { hashPassword, verifyPassword } from "../utils/PasswordUtils";
import {
  generateRefreshToken,
  hashRefreshToken,
  getRefreshTokenExpiration,
  isRefreshTokenExpired,
  isRefreshTokenRevoked,
} from "../utils/RefreshTokenUtils";

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private refreshTokenRespository: RefreshTokenRepository,
  ) { }

  async register(email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new Error("User already exists");
    const passwordHash = await hashPassword(password);
    return this.userRepository.createUser({ email, passwordHash });
  }

  async login(
    email: string,
    password: string,
    userAgent?: string,
    ip?: string,
  ) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || (await verifyPassword(password, user.passwordHash)) === false)
      throw new Error("Invalid credentials");

    const jwtToken = encodeJWT({ email: user.email });
    const refreshToken = generateRefreshToken();
    const tokenHash = hashRefreshToken(refreshToken);
    const expiresAt = getRefreshTokenExpiration();

    await this.refreshTokenRespository.createRefreshToken({
      tokenHash,
      userId: user.id,
      userAgent,
      ip,
      expiresAt,
    });

    return { token: jwtToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const tokenHash = hashRefreshToken(refreshToken);
    const storedToken =
      await this.refreshTokenRespository.findByTokenHash(tokenHash);

    if (!storedToken) throw new Error("Invalid refresh token");
    if (isRefreshTokenRevoked(storedToken.revokedAt))
      throw new Error("Refresh token has been revoked");
    if (isRefreshTokenExpired(storedToken.expiresAt))
      throw new Error("Refresh token has expired");

    const user = await this.userRepository.findById(storedToken.userId);
    if (!user) throw new Error("User not found");

    const jwtToken = encodeJWT({ email: user.email });

    return { token: jwtToken };
  }
}
