import type { Request, Response } from "express";
import { ok, sendPaginated } from "../../core/http/response";
import * as usersService from "./users.service";
import type {
  ListUsersQuery,
  UpdateUserRoleRequest,
  UpdateUserStatusRequest,
} from "./users.types";

async function listUsers(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as ListUsersQuery;
  const { users, totalItems, totalPages } = await usersService.listUsers(query);

  sendPaginated(res, users, {
    page: query.page ?? 1,
    limit: query.limit ?? 20,
    totalItems,
    totalPages: Math.max(1, totalPages),
  });
}

async function getUser(req: Request, res: Response): Promise<void> {
  const data = await usersService.getUser((req.params.id as string));
  ok(res, data);
}

async function updateUserRole(req: Request, res: Response): Promise<void> {
  const data = await usersService.updateUserRole(
    req.user!.id,
    (req.params.id as string),
    req.body as UpdateUserRoleRequest
  );
  ok(res, data);
}

async function updateUserStatus(req: Request, res: Response): Promise<void> {
  const data = await usersService.updateUserStatus(
    req.user!.id,
    (req.params.id as string),
    req.body as UpdateUserStatusRequest
  );
  ok(res, data);
}

async function updateMe(req: Request, res: Response): Promise<void> {
  const data = await usersService.updateMe(req.user!.id, req.body);
  ok(res, data);
}

async function deleteMe(req: Request, res: Response): Promise<void> {
  await usersService.deleteMe(req.user!.id);
  ok(res, null);
}

async function getSavedDestinations(req: Request, res: Response): Promise<void> {
  const data = await usersService.getSavedDestinations(req.user!.id);
  ok(res, data);
}

async function saveDestination(req: Request, res: Response): Promise<void> {
  const data = await usersService.saveDestination(req.user!.id, req.params.cityId as string);
  ok(res, data, 201);
}

async function removeSavedDestination(req: Request, res: Response): Promise<void> {
  await usersService.removeSavedDestination(req.user!.id, req.params.cityId as string);
  ok(res, null);
}

export const usersController = {
  listUsers,
  getUser,
  updateUserRole,
  updateUserStatus,
  updateMe,
  deleteMe,
  getSavedDestinations,
  saveDestination,
  removeSavedDestination,
};
