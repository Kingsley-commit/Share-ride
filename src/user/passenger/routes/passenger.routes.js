import { Router } from "express";
import { upload } from "../../../core/middlewares/multer.js";
import { validateSignup } from "../validator/signup.validator.js";
import { passengerSignup } from "../controller/signup.js";
import { validateSchema } from "../../../core/utils/validateSchema.js";
import { selectRouteSchema } from "../../../routing/validators/selectRoute.validator.js";
import { selectRoute } from "../../../routing/controllers/select-route.js";
import { joinRide, lastJoinedCompletedRide, lastJoinedNonCompletedRide } from "../../../routing/controllers/joinRide.js";
import { validateJoinRide } from "../../../routing/validators/joinRide.validator.js";
import { authGuard } from "../../../auth/authGuard/currentUser.js";

const passengerRouter = Router();

// Route for passenger signup
passengerRouter.post(
  "/signup",
  upload.single("workID"),
  validateSignup,
  passengerSignup
);

passengerRouter.post(
  "/select-routes",
  authGuard.guard,
  validateSchema(selectRouteSchema),
  selectRoute
);

passengerRouter.put(
  "/join-ride",
  authGuard.guard,
  validateJoinRide,
  joinRide
)

passengerRouter.get(
  "/last-joined-completed-ride",
  authGuard.guard,
  lastJoinedCompletedRide
)

passengerRouter.get(
  "/non-completed-ride",
  authGuard.guard,
  lastJoinedNonCompletedRide
);





export default passengerRouter;
