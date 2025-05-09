import { HttpStatus } from "../core/utils/statuscodes.js";
import { Router } from "express";
import driverRouter from "../user/driver/routes/driver.routes.js";
import passengerRouter from "../user/passenger/routes/passenger.routes.js"
import verifyRouter from "../user/admin/routes/verify.js";
import { authRouter } from "../auth/routes/signIn.js";
import routeRouter from "../routing/routes/publishRoutes.routes.js";
import ratingRouter from "../rating/routes/rating.routes.js";

export const appRouter = Router();

appRouter.use("/driver", driverRouter);
appRouter.use("/passenger", passengerRouter);
appRouter.use("/admin", verifyRouter);
appRouter.use("/auth", authRouter);
appRouter.use("/route", routeRouter);
appRouter.use("/rating", ratingRouter);

appRouter.get("/health", (_, res) => {
  res.status(HttpStatus.OK).json({
    message: "API is up and running!",
    version: "1.0",
  });
});
