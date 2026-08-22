import { existsSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

const envFilePath = path.resolve(__dirname, "../../.env");

if (existsSync(envFilePath)) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("dotenv").config({ path: envFilePath });
}

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().max(65535).default(4000),
    DATABASE_URL: z.string().optional(),
    DIRECT_URL: z.string().optional(),
    JWT_ACCESS_SECRET: z.string().default("default_jwt_secret_key_at_least_32_chars_long_for_dev_mode"),
    JWT_ACCESS_EXPIRES_IN: z
      .string()
      .regex(/^\d+(ms|s|m|h|d|w|y)?$/, "JWT_ACCESS_EXPIRES_IN must look like 15m, 1h or 86400")
      .default("15m"),
    REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().int().positive().default(30),
    OTP_EXPIRES_MINUTES: z.coerce.number().int().positive().default(10),
    CLIENT_URL: z.string().default("http://localhost:3000"),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().int().positive().max(65535).optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const smtpHostSet = Boolean(data.SMTP_HOST);
    const smtpPortSet = Boolean(data.SMTP_PORT);

    if (smtpHostSet !== smtpPortSet) {
      ctx.addIssue({
        code: "custom",
        path: smtpHostSet ? ["SMTP_PORT"] : ["SMTP_HOST"],
        message: "SMTP_HOST and SMTP_PORT must be configured together",
      });
    }

    if (data.NODE_ENV === "production" && !smtpHostSet) {
      ctx.addIssue({
        code: "custom",
        path: ["SMTP_HOST"],
        message: "SMTP is required in production",
      });
    }
  });

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const variables = result.error.issues.map((issue) => issue.path.join(".") || issue.message);
  console.error("[config] invalid environment configuration. Missing or invalid variables:");
  for (const variable of variables) {
    console.error(`  - ${variable}`);
  }
  console.error("[config] fix apps/express/.env (see apps/express/.env.example) and restart.");
  process.exit(1);
}

export const env = result.data;

export const PORT = env.PORT;
export const NODE_ENV = env.NODE_ENV;

export const isSmtpConfigured = Boolean(env.SMTP_HOST && env.SMTP_PORT);

export type Env = z.infer<typeof envSchema>;
