//add js extension while importing to avoid error

import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users/user.model.js";
import jwt from "jsonwebtoken";

// This function verifies a token
export const verifyToken = asyncHandler(async (req, _, next) => {
    try {
        // get access token
        const accessToken =
            req.cookies?.accessToken ||
            req.headers("Authorization")?.replace("Bearer ", "");

        // check if access token exists
        if (!accessToken) {
            throw new ApiError(401, "Unauthorized");
        }

        const decodedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECREAT
        );

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            // todo : frontend should handle this
            throw new ApiError(401, "Invalid Access Token");
        }
        // attach user to request
        req.user = user;
        // move to next middleware
        next();
    } catch (err) {
        throw new ApiError(401, err?.message || "Invalid Access Token");
    }
});
