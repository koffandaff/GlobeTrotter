import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { env } from "../../config/env";
import { OTP_CODE_LENGTH } from "../../config/constants";

export function generateOtp(): string {
  return randomInt(0, 10 ** OTP_CODE_LENGTH)
    .toString()
    .padStart(OTP_CODE_LENGTH, "0");
}

export function hashOtp(otp: string): string {
  return createHash("sha256").update(otp).digest("hex");
}

export function otpMatches(rawOtp: string, storedHash: string): boolean {
  const candidate = Buffer.from(hashOtp(rawOtp));
  const stored = Buffer.from(storedHash);

  return candidate.length === stored.length && timingSafeEqual(candidate, stored);
}

export function otpIsExpired(expiresAt: Date): boolean {
  return expiresAt.getTime() <= Date.now();
}

export function otpExpiryDate(): Date {
  return new Date(Date.now() + env.OTP_EXPIRES_MINUTES * 60_000);
}

export function sessionExpiryDate(): Date {
  return new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
}
