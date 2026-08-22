import type { Request, Response } from "express";
import { ok, sendPaginated, sendSuccess } from "../../core/http/response";
import * as citiesService from "./cities.service";
import type { ListCitiesQuery, PopularCitiesQuery } from "./cities.types";

async function listCities(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as ListCitiesQuery;
  const { cities, totalItems, totalPages } = await citiesService.listCities(
    req.user!.id,
    query
  );

  sendPaginated(
    res,
    cities,
    {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      totalItems,
      totalPages,
    },
    "cities retrieved successfully"
  );
}

async function getPopularCities(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as PopularCitiesQuery;
  const data = await citiesService.getPopularCities(query.limit);
  sendSuccess(res, data, "popular cities retrieved successfully");
}

async function getCity(req: Request, res: Response): Promise<void> {
  const data = await citiesService.getCity(
    req.user!.id,
    req.params.id as string
  );
  ok(res, data);
}

export const citiesController = {
  listCities,
  getPopularCities,
  getCity,
};
