import { AuthService } from "../services/AuthService";

export class AuthController {
  constructor(private authService: AuthService) { }

  async login(username: string, password: string) {
    return this.authService.login(username, password);
  }

  async register(username: string, password: string) {
    return this.authService.register(username, password);
  }
}
