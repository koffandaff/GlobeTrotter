import type { Request, Response } from "express";
import { ok, sendSuccess } from "../../core/http/response";
import * as budgetService from "./budget.service";
import type { SupportedBudgetCategory } from "./budget.types";

async function getTripBudget(req: Request, res: Response): Promise<void> {
  const data = await budgetService.getTripBudget(
    req.user!.id,
    req.params.id as string,
    req.user?.role
  );
  ok(res, data);
}

async function updateCategoryBudget(req: Request, res: Response): Promise<void> {
  const body = req.body as { amount?: number | null; budget?: number | null };
  const targetAmount = body.amount !== undefined ? body.amount : (body.budget ?? null);

  const data = await budgetService.updateCategoryBudget(
    req.user!.id,
    req.params.id as string,
    req.params.category as SupportedBudgetCategory,
    targetAmount,
    req.user?.role
  );
  sendSuccess(res, data, "category budget updated successfully");
}

export const budgetController = {
  getTripBudget,
  updateCategoryBudget,
};
