import {
  generateOtp,
  hashOtp,
  otpExpiryDate,
  otpIsExpired,
  otpMatches,
  sessionExpiryDate,
} from "../../core/auth/otp";
import { hashPassword, verifyPassword } from "../../core/auth/password";
import { generateRefreshToken, hashToken } from "../../core/auth/tokens";
import { signAccessToken } from "../../core/auth/jwt";
import { AuthenticationError, ConflictError, NotFoundError, ValidationError } from "../../core/errors/app-error";
import { logger } from "../../core/logger/logger";
import { createAuditLog } from "../../core/audit/audit.service";
import { sendOtpCode } from "../../shared/email";
import * as authRepository from "./auth.repository";
import type {
  AuthUserDto,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponseDto,
  RefreshRequest,
  RegisterRequest,
  ResetPasswordRequest,
  TokenPairDto,
  VerifyOtpRequest,
} from "./auth.types";

function toAuthUserDto(user: authRepository.UserRecord): AuthUserDto {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}

async function verifyOtpAndReturnUserId(
  user: authRepository.UserWithPassword | null,
  code: string,
): Promise<string> {
  if (!user) {
    throw new ValidationError("invalid or expired verification code");
  }

  const otp = await authRepository.findLatestUnusedOtp(user.id);
  if (!otp) {
    throw new ValidationError("invalid or expired verification code");
  }

  if (otpIsExpired(otp.expiresAt)) {
    throw new ValidationError("verification code has expired");
  }

  if (!otpMatches(code, otp.token)) {
    throw new ValidationError("invalid verification code");
  }

  await authRepository.markOtpUsed(otp.id);
  return user.id;
}

export async function login(input: LoginRequest): Promise<LoginResponseDto> {
  const user = await authRepository.findUserByEmail(input.email);
  if (!user) {
    throw new AuthenticationError("invalid email or password");
  }

  const passwordValid = await verifyPassword(input.password, user.passwordHash);
  if (!passwordValid) {
    throw new AuthenticationError("invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    throw new AuthenticationError("account is not active");
  }

  const refreshToken = generateRefreshToken();
  await authRepository.recordLogin(user.id, hashToken(refreshToken), sessionExpiryDate());

  return {
    user: toAuthUserDto(user),
    tokens: {
      accessToken: signAccessToken({ sub: user.id, role: user.role }),
      refreshToken,
    },
  };
}

export async function refresh(input: RefreshRequest): Promise<TokenPairDto> {
  const session = await authRepository.findSessionByToken(hashToken(input.refreshToken));
  if (!session) {
    throw new AuthenticationError("invalid refresh token");
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await authRepository.deleteSession(session.id);
    throw new AuthenticationError("refresh token expired");
  }

  if (session.user.status !== "ACTIVE") {
    throw new AuthenticationError("account is not active");
  }

  const refreshToken = generateRefreshToken();
  await authRepository.rotateSession(session.id, hashToken(refreshToken), sessionExpiryDate());

  return {
    accessToken: signAccessToken({ sub: session.user.id, role: session.user.role }),
    refreshToken,
  };
}

export async function logout(input: RefreshRequest): Promise<void> {
  const session = await authRepository.findSessionByToken(hashToken(input.refreshToken));
  if (session) {
    await authRepository.deleteSession(session.id);
  }
}

export async function me(userId: string): Promise<AuthUserDto> {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new NotFoundError("user not found");
  }
  return toAuthUserDto(user);
}

export async function changePassword(userId: string, input: ChangePasswordRequest): Promise<void> {
  const user = await authRepository.findUserByIdWithPassword(userId);
  if (!user) {
    throw new NotFoundError("user not found");
  }

  const currentValid = await verifyPassword(input.currentPassword, user.passwordHash);
  if (!currentValid) {
    throw new AuthenticationError("current password is incorrect");
  }

  await authRepository.resetPassword(userId, await hashPassword(input.newPassword));
}

export async function forgotPassword(input: ForgotPasswordRequest): Promise<void> {
  const user = await authRepository.findUserByEmail(input.email);
  if (!user || user.status !== "ACTIVE") {
    logger.info("forgot-password requested for unknown or inactive email", { email: input.email });
    return;
  }

  const otp = generateOtp();
  await authRepository.createOtpToken(user.id, hashOtp(otp), otpExpiryDate());
  await sendOtpCode(user.email, user.displayName ?? user.firstName, otp);

  logger.info("verification code issued", { userId: user.id });
}

export async function verifyOtp(input: VerifyOtpRequest): Promise<void> {
  const user = await authRepository.findUserByEmail(input.email);
  await verifyOtpAndReturnUserId(user, input.otp);
}

export async function resetPassword(input: ResetPasswordRequest): Promise<void> {
  const user = await authRepository.findUserByEmail(input.email);
  const userId = await verifyOtpAndReturnUserId(user, input.otp);

  await authRepository.resetPassword(userId, await hashPassword(input.newPassword));
  
  await createAuditLog({
    userId: userId,
    action: "PASSWORD_RESET",
    entityType: "User",
    entityId: userId,
  });
}

export async function acceptInvitation(input: ResetPasswordRequest): Promise<AuthUserDto> {
  const user = await authRepository.findUserByEmail(input.email);
  const userId = await verifyOtpAndReturnUserId(user, input.otp);

  await authRepository.resetPassword(userId, await hashPassword(input.newPassword));

  const accepted = await authRepository.findUserById(userId);
  return toAuthUserDto(accepted!);
}

export async function register(input: RegisterRequest): Promise<AuthUserDto> {
  const existing = await authRepository.findUserByEmail(input.email);
  if (existing) {
    throw new ConflictError("a user with this email already exists");
  }

  const user = await authRepository.registerInvitedUser({
    firstName: input.firstName,
    lastName: input.lastName,
    displayName: input.displayName ?? null,
    email: input.email,
    role: "USER",
    passwordHash: await hashPassword(input.password),
    phone: input.phone,
    city: input.city,
    country: input.country,
    additionalInfo: input.additionalInfo,
  });

  logger.info("user registered", { userId: user.id, role: user.role });

  await createAuditLog({
    userId: user.id,
    action: "USER_REGISTER",
    entityType: "User",
    entityId: user.id,
  });

  return toAuthUserDto(user);
}