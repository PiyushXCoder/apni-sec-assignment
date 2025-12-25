import { JWTPayload } from "../types/jwt";
import jwt from "jsonwebtoken";

const secret = String(process.env.JWT_SECRET);

export function encodeJWT(payload: JWTPayload): string {
  const token = jwt.sign(payload, secret, {
    expiresIn: "1h",
  });
  return token;
}

export function decodeJWT(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token: " + (error as Error).message);
  }
}
