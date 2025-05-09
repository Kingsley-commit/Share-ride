import { Router } from "express";
import { publishRoutes } from "../controllers/publishroutes.js";
import { validateRide } from "../validators/publish.validator.js";
import { authGuard } from "../../auth/authGuard/currentUser.js";

const routeRouter = Router();

routeRouter.post("/publish", authGuard.guard, validateRide, publishRoutes);

export default routeRouter;
