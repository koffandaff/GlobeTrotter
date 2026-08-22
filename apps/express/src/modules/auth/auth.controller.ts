import type { Request, Response } from "express";
import { ok } from "../../core/http/response";
import * as authService from "./auth.service";
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
} from "./auth.types";

async function login(req: Request, res: Response): Promise<void> {
  const data = await authService.login(req.body as LoginRequest);
  ok(res, data);
}

async function register(req: Request, res: Response): Promise<void> {
  const data = await authService.register(req.body as RegisterRequest);
  ok(res, data, 201);
}

async function refresh(req: Request, res: Response): Promise<void> {
  const data = await authService.refresh(req.body as RefreshRequest);
  ok(res, data);
}

async function logout(req: Request, res: Response): Promise<void> {
  await authService.logout(req.body as RefreshRequest);
  ok(res, null);
}

async function me(req: Request, res: Response): Promise<void> {
  const data = await authService.me(req.user!.id);
  ok(res, data);
}

async function changePassword(req: Request, res: Response): Promise<void> {
  await authService.changePassword(req.user!.id, req.body as ChangePasswordRequest);
  ok(res, null);
}

async function forgotPassword(req: Request, res: Response): Promise<void> {
  await authService.forgotPassword(req.body as ForgotPasswordRequest);
  ok(res, null);
}

async function verifyOtp(req: Request, res: Response): Promise<void> {
  await authService.verifyOtp(req.body as VerifyOtpRequest);
  ok(res, null);
}

async function resetPassword(req: Request, res: Response): Promise<void> {
  await authService.resetPassword(req.body as ResetPasswordRequest);
  ok(res, null);
}

async function acceptInvite(req: Request, res: Response): Promise<void> {
  const data = await authService.acceptInvitation(req.body as ResetPasswordRequest);
  ok(res, { id: data.id });
}

export const authController = {
  login,
  register,
  refresh,
  logout,
  me,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
  acceptInvite,
};
