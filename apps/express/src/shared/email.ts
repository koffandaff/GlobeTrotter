import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";
import { env } from "../config/env";
import { ExternalServiceError } from "../core/errors/app-error";
import { logger } from "../core/logger/logger";

let transporter: Transporter | null = null;

if (env.SMTP_HOST && env.SMTP_PORT) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS ?? "" } : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  });
}

interface EmailMessage {
  to: string;
  subject: string;
  text: string;
}

async function deliver(message: EmailMessage): Promise<void> {
  if (!transporter) {
    if (env.NODE_ENV === "production") {
      throw new ExternalServiceError("email system is not configured");
    }

    logger.info("[email] SMTP not configured - printing message to console", {
      to: message.to,
      subject: message.subject,
      body: message.text,
    });
    return;
  }

  if (env.NODE_ENV !== "production") {
    logger.info("[email] message prepared", {
      to: message.to,
      subject: message.subject,
      body: message.text,
    });
  }

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM ?? "no-reply@localhost",
      ...message,
    });
    logger.info("email sent", { to: message.to, subject: message.subject });
  } catch (error) {
    logger.error("email delivery failed", {
      to: message.to,
      message: error instanceof Error ? error.message : String(error),
    });
    throw new ExternalServiceError("failed to send email");
  }
}

export function sendOtpCode(to: string, name: string | null, code: string): Promise<void> {
  if (env.NODE_ENV !== "production") {
    logger.info("verification code for user", { to, code });
  }
  const greeting = name ? `Hi ${name},` : "Hi,";
  return deliver({
    to,
    subject: "Verification code",
    text: [
      greeting,
      "",
      "Your verification code is:",
      "",
      code,
      "",
      `This code expires in ${env.OTP_EXPIRES_MINUTES} minutes. If you did not request it, you can ignore this email.`,
      "",
      `To reset your password, open ${env.CLIENT_URL}/reset-password and enter your email address and the code above.`,
    ].join("\n"),
  });
}

export function sendInviteEmail(to: string, name: string, code: string): Promise<void> {
  if (env.NODE_ENV !== "production") {
    logger.info("invitation code for user", { to, code });
  }
  return deliver({
    to,
    subject: "You have been invited",
    text: [
      `Hi ${name},`,
      "",
      "An administrator has created your account.",
      "",
      `HOW TO ACCEPT YOUR INVITE:`,
      "",
      `1. Open this page in your browser: ${env.CLIENT_URL}/accept-invite`,
      `2. Enter the email address you were invited with.`,
      `3. Enter the verification code below: ${code}`,
      `4. Choose a password and click Set Password - you will be signed in.`,
      "",
      `This code expires in ${env.OTP_EXPIRES_MINUTES} minutes.`,
      "",
      "If you were not expecting this email, you can ignore it.",
    ].join("\n"),
  });
}
