import { Router } from "express";
import type { Request } from "express";
import rateLimit, { type RateLimitRequestHandler } from "express-rate-limit";

interface RateLimitedRequest extends Request {
  rateLimit: { resetTime: Date };
}
import { authenticate } from "../../core/auth/guards";
import { validateBody } from "../../core/middleware/validate";
import {
  LOGIN_RATE_LIMIT_MAX,
  OTP_RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  REGISTER_RATE_LIMIT_MAX,
} from "../../config/constants";
import { authController } from "./auth.controller";
import {
  acceptInviteSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "./auth.schema";

const router = Router();

function createLimiter(max: number): RateLimitRequestHandler {
  return rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    limit: max,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (req, res) => {
      const retryAfterMs = (req as RateLimitedRequest).rateLimit.resetTime.getTime() - Date.now();
      res.setHeader("Retry-After", String(Math.max(1, Math.ceil(retryAfterMs / 1000))));
      res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "too many requests, please try again later",
        },
      });
    },
  });
}

router.post("/login", createLimiter(LOGIN_RATE_LIMIT_MAX), validateBody(loginSchema), authController.login);

router.post(
  "/register",
  createLimiter(REGISTER_RATE_LIMIT_MAX),
  validateBody(registerSchema),
  authController.register
);

router.post("/refresh", validateBody(refreshSchema), authController.refresh);

router.post("/logout", authenticate, validateBody(refreshSchema), authController.logout);

router.get("/me", authenticate, authController.me);

router.post(
  "/change-password",
  authenticate,
  validateBody(changePasswordSchema),
  authController.changePassword
);

router.post(
  "/forgot-password",
  createLimiter(OTP_RATE_LIMIT_MAX),
  validateBody(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  "/verify-otp",
  createLimiter(OTP_RATE_LIMIT_MAX),
  validateBody(verifyOtpSchema),
  authController.verifyOtp
);

router.post(
  "/reset-password",
  createLimiter(OTP_RATE_LIMIT_MAX),
  validateBody(resetPasswordSchema),
  authController.resetPassword
);

router.post(
  "/accept-invite",
  createLimiter(OTP_RATE_LIMIT_MAX),
  validateBody(acceptInviteSchema),
  authController.acceptInvite
);

export default router;
