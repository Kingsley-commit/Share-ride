import {signIn } from "../controllers/signIn.js";
import { Router } from "express";
import { validateSignIn } from "../validator/signin.validator.js";


export const authRouter = Router();

authRouter.post("/signin",validateSignIn, signIn);
