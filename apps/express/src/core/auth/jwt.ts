import type { UserRole } from "@prisma/client";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { AuthenticationError } from "../errors/app-error";
import type { AccessTokenPayload } from "./types";

const ALGORITHM = "HS256";

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    algorithm: ALGORITHM,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as unknown as SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: [ALGORITHM] });

    if (typeof decoded === "string") {
      throw new Error("unexpected string payload");
    }

    const { sub, role } = decoded;
    if (typeof sub !== "string" || typeof role !== "string") {
      throw new Error("malformed token payload");
    }

    return { sub, role: role as UserRole };
  } catch {
    throw new AuthenticationError("invalid or expired access token");
  }
}
