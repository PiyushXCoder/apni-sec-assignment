import { UserRepository } from "../repositories/UserRepository";
import { encodeJWT } from "../utils/jwtUtils";
import { hashPassword, verifyPassword } from "../utils/PasswordUtils";

export class AuthService {
  constructor(private userRepository: UserRepository) { }

  async register(email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new Error("User already exists");
    const passwordHash = await hashPassword(password);
    return this.userRepository.createUser({ email, passwordHash });
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || (await verifyPassword(password, user.passwordHash)) === false)
      throw new Error("Invalid credentials");
    const jwtToken = encodeJWT({ email: user.email });
    return { token: jwtToken };
  }
}
