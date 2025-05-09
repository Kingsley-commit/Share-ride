import { Router } from "express";
import { rateDriver } from "../controllers/rate-ride.js";
import { authGuard } from "../../auth/authGuard/currentUser.js";
import { ratePassenger } from "../controllers/rate-ride.js";
import { validateRateDriver } from "../validators/rate-driver.validator.js";
import { validateRatePassenger } from "../validators/rate-passenger.validator.js";
import { getRatings } from "../controllers/rate-ride.js";


const ratingRouter = Router();

ratingRouter.post("/rate-driver", authGuard.guard, validateRateDriver, rateDriver);
ratingRouter.post("/rate-passenger", authGuard.guard, validateRatePassenger, ratePassenger);
ratingRouter.get("/ratings/:ratedId", getRatings);

export default ratingRouter;
