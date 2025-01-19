import dotenv from "dotenv";
dotenv.config();
import express, { json } from "express";
import routes from "./routes/routes.js";
import GetItemsAdapter from "./utils/GetItemsAdapter/GetItemsAdapter.js";

export function createApp() {
  const getItems = new GetItemsAdapter();
  getItems.fetchAndSaveData();

  const app = express();

  app.use(json());

  app.use(routes);

  return app;
}
