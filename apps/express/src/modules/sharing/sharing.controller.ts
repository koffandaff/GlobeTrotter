import { Request, Response } from "express";
import { ok } from "../../core/http/response";
import * as sharingService from "./sharing.service";

async function createShare(req: Request, res: Response): Promise<void> {
  const data = await sharingService.createShare(
    req.user!.id,
    req.params.id as string,
    req.body
  );
  ok(res, data, 201);
}

async function revokeShare(req: Request, res: Response): Promise<void> {
  await sharingService.revokeShare(req.user!.id, req.params.id as string);
  ok(res, null);
}

async function getSharedTrip(req: Request, res: Response): Promise<void> {
  const data = await sharingService.getSharedTrip(req.params.shareSlug as string);
  ok(res, data);
}

async function copySharedTrip(req: Request, res: Response): Promise<void> {
  const data = await sharingService.copySharedTrip(
    req.user!.id,
    req.params.shareSlug as string
  );
  ok(res, data, 201);
}

export const sharingController = {
  createShare,
  revokeShare,
  getSharedTrip,
  copySharedTrip,
};
