import { Router } from "express";
import { authenticate } from "../../core/auth/guards";
import { validateParams, validateQuery } from "../../core/middleware/validate";
import { citiesController } from "./cities.controller";
import {
  cityIdParamsSchema,
  listCitiesQuerySchema,
  popularCitiesQuerySchema,
} from "./cities.schema";

const router = Router();

router.use(authenticate);

router.get("/", validateQuery(listCitiesQuerySchema), citiesController.listCities);

router.get(
  "/popular",
  validateQuery(popularCitiesQuerySchema),
  citiesController.getPopularCities
);

router.get(
  "/:id",
  validateParams(cityIdParamsSchema),
  citiesController.getCity
);

export default router;
