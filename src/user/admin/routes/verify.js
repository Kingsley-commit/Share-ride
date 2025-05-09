import { Router } from "express";
import { verifyUser } from "../controller/verifyUser.js";
import { verifyEmail } from "../controller/verifyEmail.js";
// import { authGuard } from "../../../auth/authGuard/currentUser.js";


const verifyRouter = Router();


// Route for verifying a user
verifyRouter.get("/verify-user", verifyUser);
verifyRouter.get("/verify-email", verifyEmail)

export default verifyRouter;