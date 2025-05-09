import { createServer } from "http";
import { app } from "./app.services.js";
import { config } from "../core/config/env.js";

export const startApp = async () => {
  const server = createServer(app);

  server.listen(config.port, () => console.log("server running"));
};
