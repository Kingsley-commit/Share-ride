import transporter from "../config/nodemailer.js";
import { config } from "../config/env.js";

// export const verifyDriver = async (driverDetails) => {
//   const mailOptions = {
//     from: '"RidePal Admin" <no-reply@ridepal.com>', // sender address
//     to: "config.admin.email",
//     subject: "New Driver Registration - Verification Required", // Subject line
//     text: `A new driver has registered and requires verification. Details: ${JSON.stringify(
//       driverDetails,
//       null,
//       2
//     )}`, // plain text body
//     html: `<p>A new driver has registered and requires verification. Details:</p><pre>${JSON.stringify(
//       driverDetails,
//       null,
//       2
//     )}</pre>`, // html body
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Verification email sent to admin.");
//   } catch (error) {
//     console.error("Error sending verification email:", error);
//   }
// };

// export const verifyUser = async (details, token) => {
//   const link = `https://ride-pal-1.onrender.com/api/admin/verify-user?token=${token}`;
//   const mailOptions1 = {
//     from: '"RidePal Admin" <no-reply@ridepal.com>', // sender address
//     to: config.admin.email,
//     subject: "A new passenger Registration - Verification Required", // Subject line
//     text: `A new passenger has registered and requires verification. Details: ${JSON.stringify(
//       details,
//       null,
//       2
//     )}`, // plain text body
//     html: `<p>A new passenger has registered and requires verification. Details:</p><pre>${JSON.stringify(
//       details,
//       null,
//       2
//     )}</pre>, // html body
//     <p><a href="${link}">Click here to verify this user</a></p>`
//   };

//   const mailOptions2 = {
//     from: '"RidePal Admin" <no-reply@ridepal.com>', // sender address
//     to: config.admin.email,
//     subject: "New Driver Registration - Verification Required", // Subject line
//     text: `A new driver has registered and requires verification. Details: ${JSON.stringify(
//       details,
//       null,
//       2
//     )}`, // plain text body
//     html: `<p>A new driver has registered and requires verification. Details:</p><pre>${JSON.stringify(
//       details,
//       null,
//       2
//     )}</pre>,
//     <p><a href="${link}">Click here to verify this user</a></p>`
//   };

//   let mailOptions = details.vehicle ? mailOptions2 : mailOptions1;

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Verification email sent to admin.");
//   } catch (error) {
//     console.error("Error sending verification email:", error);
//   }
// };

import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyUser = async (details, token) => {
  const link = `https://ride-pal.onrender.com/api/admin/verify-user?token=${token}`;

  // Read the template file
  const templatePath = path.join(__dirname, "emailTemplate.hbs");

  const source = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(source, {
    allowProtoPropertiesByDefault: true,
  });

  // Data to be injected into the template
  const data = {
    user: details.user,
    vehicle: details.vehicle,
    verificationLink: link,
  };

  const transformToPlainObject = (data) => {
    return JSON.parse(JSON.stringify(data));
  };

  const plainEmailData = transformToPlainObject(data);

  const html = template(plainEmailData);

  const mailOptions = {
    from: '"RidePal Admin" <no-reply@ridepal.com>', // sender address
    to: config.admin.email,
    subject: `New ${
      details.user.type.charAt(0).toUpperCase() + details.user.type.slice(1)
    } Registration - Verification Required`, // Subject line
    html: html, // html body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to admin.");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export const sendEmailVerification = async (user) => {
  const verificationUrl = `https://ride-pal.onrender.com/api/admin/verify-email?token=${user.verificationToken}`;

  const mailOptions = {
    from: '"RidePal Admin" <no-reply@ridepal.com>',
    to: user.email,
    subject: "Verify your Email - RidePal",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2 style="color: #333;">Welcome to RidePal!</h2>
        <p>Hi ${user.firstName || "there"},</p>
        <p>Thank you for signing up with RidePal. To get started, please verify your email address by clicking the link below:</p>
        <p style="text-align: center;">
          <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        </p>
        <p>If the button above doesn't work, copy and paste the following link into your web browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>If you did not sign up for a RidePal account, please disregard this email.</p>
        <p>Best regards,<br/>The RidePal Team</p>
      </div>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to user.");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export const notifyUser = async (email) => {
  const mailOptions = {
    from: '"RidePal Admin" <no-reply@ridepal.com>', // sender address
    to: email,
    subject: "Account Verification Successful", // Subject line
    text: `You Ride pal account have successfully been verified!!, vist`, // plain text body
    html: `You Ride pal account have successfully been verified!!, visit your account to start enjoying our services`, // html body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to user.");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
