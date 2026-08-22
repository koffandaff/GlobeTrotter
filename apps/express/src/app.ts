import express from "express";
import { requestIdMiddleware } from "./core/middleware/request-id";
import { requestLoggerMiddleware } from "./core/logger/request-logger";
import { errorMiddleware } from "./core/middleware/error.middleware";
import { sendError } from "./core/http/response";
import { API_PREFIX } from "./config/constants";
import { authRouter } from "./modules/auth";
import usersRouter from "./modules/users";
import { dashboardRouter } from "./modules/dashboard";
import { activitiesRouter } from "./modules/activities";
import { tripsRouter } from "./modules/trips";
import { sharingRouter } from "./modules/sharing";
import { stopsRouter } from "./modules/trip-stops";
import { tripActivitiesRouter } from "./modules/trip-activities";
import { itineraryViewsRouter } from "./modules/itinerary-views";
import { citiesRouter } from "./modules/cities";
import { communityRouter } from "./modules/community";
import { adminRouter } from "./modules/admin";

const app = express();

app.set("trust proxy", 1);

app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);
app.use(express.json({ limit: "16mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", database: "up" });
});

app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/users`, usersRouter);
app.use(`${API_PREFIX}/dashboard`, dashboardRouter);
app.use(`${API_PREFIX}/activities`, activitiesRouter);
app.use(`${API_PREFIX}/cities`, citiesRouter);
app.use(`${API_PREFIX}/trips`, tripsRouter);
app.use(API_PREFIX, sharingRouter);
app.use(`${API_PREFIX}/stops`, stopsRouter);
app.use(`${API_PREFIX}`, tripActivitiesRouter);
app.use(`${API_PREFIX}/community`, communityRouter);
app.use(`${API_PREFIX}`, itineraryViewsRouter);
app.use(`${API_PREFIX}/admin`, adminRouter);

app.use((_req, res) => {
  sendError(res, "Route not found", 404, "ROUTE_NOT_FOUND");
});

app.use(errorMiddleware);

export default app;