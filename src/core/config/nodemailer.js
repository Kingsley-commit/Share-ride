import nodemailer from "nodemailer";
import { config } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.mailsender.email,
    pass: config.mailsender.password,
  },
});

export default transporter;
