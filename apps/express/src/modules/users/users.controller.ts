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

export const usersController = {
  listUsers,
  getUser,
  updateUserRole,
  updateUserStatus,
};
