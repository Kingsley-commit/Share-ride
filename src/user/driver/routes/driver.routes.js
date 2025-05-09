import { Router } from "express";
import { signUpDriver } from "../controller/signup.js";
import { upload } from "../../../core/middlewares/multer.js";
import { validateSignup } from "../validator/signup.validator.js";
import { getVehicle } from "../controller/getVehicle.js";
import { validateGetVehicle } from "../validator/getVehicle.validator.js";
import { validateStartRide } from "../../../routing/validators/startRide.validator.js";
import { startRide } from "../../../routing/controllers/startRide.js";
import { endRide } from "../../../routing/controllers/endRide.js";
import { cancelRide } from "../../../routing/controllers/cancelRide.js";
import { authGuard } from "../../../auth/authGuard/currentUser.js";
import {
  ongoingRide,
  pendingRide,
} from "../../../routing/controllers/driver-current-ride.js";

const driverRouter = Router();

driverRouter.post(
  "/signup",
  upload.single("workID"),
  validateSignup,
  signUpDriver
);

driverRouter.post("/get-vechile", validateGetVehicle, getVehicle);

driverRouter.post("/start-ride", authGuard.guard, validateStartRide, startRide);

driverRouter.post(
  "/cancel-ride",
  authGuard.guard,
  validateStartRide,
  cancelRide
);

driverRouter.post("/end-ride", authGuard.guard, validateStartRide, endRide);

driverRouter.get("/ongoing-ride", authGuard.guard, ongoingRide);

driverRouter.get("/pending-ride", authGuard.guard, pendingRide);

export default driverRouter;
