import { z } from "zod";
import { PASSWORD_MAX_LENGTH } from "../../config/constants";
import { isStrongPassword } from "../../core/auth/password";

const emailSchema = z
  .email("a valid email address is required")
  .transform((email) => email.trim().toLowerCase());

const passwordSchema = z
  .string()
  .refine(isStrongPassword, "password must be 8-72 characters and contain at least one letter and one number");

const otpSchema = z.string().regex(/^\d{6}$/, "verification code must be exactly 6 digits");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "password is required").max(PASSWORD_MAX_LENGTH),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "firstName is required")
    .max(100, "firstName must be at most 100 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "lastName is required")
    .max(100, "lastName must be at most 100 characters"),
  displayName: z
    .string()
    .trim()
    .max(100, "displayName must be at most 100 characters")
    .optional(),
  email: emailSchema,
  password: passwordSchema,
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "current password is required").max(PASSWORD_MAX_LENGTH),
  newPassword: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
  newPassword: passwordSchema,
});

export const acceptInviteSchema = resetPasswordSchema;
