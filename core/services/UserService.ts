import { UserRepository } from "../repositories/UserRepository";
import { hashPassword } from "../utils/PasswordUtils";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getProfile(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(
    email: string,
    data: { email?: string; password?: string }
  ) {
    if (!data.email && !data.password) {
      throw new Error("At least one field (email or password) is required");
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const updateData: { email?: string; passwordHash?: string } = {};

    if (data.email) {
      if (data.email !== user.email) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
          throw new Error("Email already in use");
        }
      }
      updateData.email = data.email;
    }

    if (data.password) {
      if (data.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      updateData.passwordHash = await hashPassword(data.password);
    }

    const updatedUser = await this.userRepository.updateUser(
      user.id,
      updateData
    );

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      emailVerifiedAt: updatedUser.emailVerifiedAt,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
