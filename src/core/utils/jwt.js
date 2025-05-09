import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const decode = (token) => {
    const decoded = jwt.verify(token, config.auth.accessTokenSecret);
    return decoded
};

export const jwtSign = (userid) => {
    const token = jwt.sign({ userid: userid }, config.auth.accessTokenSecret, {
      expiresIn: "20h",
    });
    return token
};
