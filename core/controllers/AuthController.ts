import { AuthService } from "../services/AuthService";

export class AuthController {
  constructor(private authService: AuthService) { }

  async login(
    username: string,
    password: string,
    userAgent: string,
    ip: string,
  ) {
    return this.authService.login(username, password, userAgent, ip);
  }

  async register(username: string, password: string) {
    return this.authService.register(username, password);
  }

  async refreshToken(refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
