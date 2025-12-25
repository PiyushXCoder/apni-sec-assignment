import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  const digest = await bcrypt.hash(password, 10);
  return digest.toString();
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}
