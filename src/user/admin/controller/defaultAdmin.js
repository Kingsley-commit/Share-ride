
import Admin from "../../model/admin.js";
import { config } from "../../../core/config/env.js";
import { logger } from "../../../core/loggers/logger.js";
import { hashPassword } from "../../../core/utils/bcrypt.js";


export const defaultAdmin = async () => {

    const admins = await Admin.findAll();

    if (admins.length > 0) {
        return;
    }

    const admin = {
        email: config.admin.email,
        password: await hashPassword(config.admin.password),
        username: config.admin.userName,
    };

    try {
        await Admin.create(admin);
        logger.info("Default admin created successfully");
    } catch (error) {
        logger.error("Error creating default admin", error);
    }


};