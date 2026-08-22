import { createHash, randomBytes } from "node:crypto";
import { hashPassword } from "./password";

export function generateRefreshToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function generateUnusablePasswordHash(): Promise<string> {
  return hashPassword(randomBytes(32).toString("hex"));
}
