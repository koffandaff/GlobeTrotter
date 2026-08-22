import { Prisma } from "@prisma/client";
import type { PasswordResetToken, Session, UserStatus, UserRole } from "@prisma/client";
import { ConflictError } from "../../core/errors/app-error";
import { prisma } from "../../shared/prisma";

export const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  displayName: true,
  avatarUrl: true,
  role: true,
  status: true,
  emailVerified: true,
  lastLoginAt: true,
  createdAt: true,
} as const;

export type UserRecord = Prisma.UserGetPayload<{ select: typeof userSelect }>;

const userWithPasswordSelect = { ...userSelect, passwordHash: true } as const;

export type UserWithPassword = Prisma.UserGetPayload<{ select: typeof userWithPasswordSelect }>;

export function findUserByEmail(email: string): Promise<UserWithPassword | null> {
  return prisma.user.findUnique({ where: { email }, select: userWithPasswordSelect });
}

export function findUserById(id: string): Promise<UserRecord | null> {
  return prisma.user.findUnique({ where: { id }, select: userSelect });
}

export function findUserByIdWithPassword(id: string): Promise<UserWithPassword | null> {
  return prisma.user.findUnique({ where: { id }, select: userWithPasswordSelect });
}

export async function registerInvitedUser(input: {
  firstName: string;
  lastName: string;
  displayName?: string | null;
  email: string;
  role: UserRole;
  passwordHash: string;
  otpHash?: string | null;
  otpExpiresAt?: Date | null;
}): Promise<UserRecord> {
  try {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          displayName: input.displayName ?? null,
          email: input.email,
          role: input.role,
          passwordHash: input.passwordHash,
        },
        select: userSelect,
      });

      if (input.otpHash && input.otpExpiresAt) {
        await tx.passwordResetToken.create({
          data: { userId: user.id, token: input.otpHash, expiresAt: input.otpExpiresAt },
        });
      }

      return user;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ConflictError("a user with this email already exists");
    }
    throw error;
  }
}

export async function recordLogin(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } }),
    prisma.session.create({ data: { userId, token: tokenHash, expiresAt } }),
  ]);
}

export function findSessionByToken(
  tokenHash: string
): Promise<(Session & { user: { id: string; role: UserRole; status: UserStatus } }) | null> {
  return prisma.session.findUnique({
    where: { token: tokenHash },
    include: { user: { select: { id: true, role: true, status: true } } },
  });
}

export async function rotateSession(id: string, tokenHash: string, expiresAt: Date): Promise<void> {
  await prisma.session.update({ where: { id }, data: { token: tokenHash, expiresAt } });
}

export function deleteSession(id: string): Promise<Session> {
  return prisma.session.delete({ where: { id } });
}

export function findLatestUnusedOtp(userId: string): Promise<PasswordResetToken | null> {
  return prisma.passwordResetToken.findFirst({
    where: { userId, usedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function createOtpToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
  await prisma.$transaction([
    prisma.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.create({ data: { userId, token: tokenHash, expiresAt } }),
  ]);
}

export function markOtpUsed(id: string): Promise<PasswordResetToken> {
  return prisma.passwordResetToken.update({ where: { id }, data: { usedAt: new Date() } });
}

export async function resetPassword(userId: string, passwordHash: string): Promise<void> {
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { passwordHash } }),
    prisma.session.deleteMany({ where: { userId } }),
  ]);
}
