import { UserService } from "../services/UserService";

export class UserController {
  constructor(private userService: UserService) {}

  async getProfile(email: string) {
    return this.userService.getProfile(email);
  }

  async updateProfile(email: string, data: { email?: string; password?: string }) {
    return this.userService.updateProfile(email, data);
  }
}
