//add js extension while importing to avoid error

import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users/user.model.js";
import jwt from "jsonwebtoken";

// The code is a JavaScript module that handles token verification in an API using Express middleware.
// The verifyToken function verifies the access token provided in the request using JWT and a secret key.
// It retrieves the user associated with the token from the database, excluding sensitive fields.
// If the token or user is invalid, it throws an ApiError with a status code of 401 (Unauthorized).
// If the token is valid and the user is found, the user object is attached to the request for further processing.

// This function verifies a token
export const verifyToken = asyncHandler(async (req, _, next) => {
      try {
            // get access token
            const accessToken = req.cookies?.accessToken || req.headers?.authorization?.replace("Bearer ", "");

            // check if access token exists
            if (!accessToken) {
                  throw new ApiError(401, "Unauthorized");
            }
            // verify access token
            const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            // get user from db
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

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
