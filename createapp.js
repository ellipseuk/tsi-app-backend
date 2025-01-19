import dotenv from "dotenv";
dotenv.config();
import express, { json } from "express";
import routes from "./routes/routes.js";

export function createApp() {
  const app = express();

  app.use(json());

  app.use(routes);

  return app;
}
