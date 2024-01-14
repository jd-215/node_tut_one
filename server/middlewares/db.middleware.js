import connectDB from "../db/dbFile.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verify_DB_Connection = asyncHandler(async (req, _, next) => { 
        connectDB
            .then(() => {
                console.log("connection to DB established");
                next()
            })
            .catch((err) => new ApiError(500, err?.message || "Internal Server Error"))
})