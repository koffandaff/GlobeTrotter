import bcrypt from "bcryptjs";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../../config/constants";

const BCRYPT_COST = 12;

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)\S{8,72}$/;

export function isStrongPassword(password: string): boolean {
  const byteLength = Buffer.byteLength(password, "utf8");
  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    password.length <= PASSWORD_MAX_LENGTH &&
    byteLength <= 72 &&
    PASSWORD_PATTERN.test(password)
  );
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
