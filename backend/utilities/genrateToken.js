 import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVar.js";

export const genrateTokenAndSetCokkie = (userId, res) => {
    const token = jwt.sign({ userId }, ENV_VARS.JWTSECRET, {
        expiresIn: "14d",
    });

    res.cookie("jwtnetflixCookie", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true,
        sameSite: "None", // Changed false to "None" for proper cross-site behavior
        secure: ENV_VARS.NODEENV !== "development",
    });

    return token;
};
