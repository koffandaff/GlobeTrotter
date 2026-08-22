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

app.use((_req, res) => {
  sendError(res, "Route not found", 404, "ROUTE_NOT_FOUND");
});

app.use(errorMiddleware);

export default app;
