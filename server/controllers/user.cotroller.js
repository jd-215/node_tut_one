import { response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/users/user.model.js";
import { uploadOnCloudiNary } from "../utils/cloudinary.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user from frontend
    //validation - not empty
    // check if user already exists
    //check for images , checfor avatar
    // upload them to cloudnary
    // create user object - create entry in db
    // romove password and refresh token field from response
    // check for user creation
    // return a response

    const { username, email, password, fullName } = req.body;
    console.table(req.body);

    if (
        [username, email, password, fullName].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new ApiError(409, "User already exists with this email or username");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    console.log("file details",req.files)
    console.log("file details",req.files?.avatar[0]?.path)
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    console.log("file details local path =",avatarLocalPath, coverImageLocalPath)

    if(!avatarLocalPath ) throw new ApiError(400, "avatar is required");
    if(!coverImageLocalPath) throw new ApiError(400, "coverImage is required");

    const avatarUrl = await uploadOnCloudiNary(avatarLocalPath);
    const coverImageUrl = await uploadOnCloudiNary(coverImageLocalPath);
    

    const user = await User.create({
        username,
        email,
        password,
        fullName,
        avatar: avatarUrl || "",
        coverImage: coverImageUrl || ""
    });
    const userResponse = await User.findById(user._id).select("-password -refreshToken");
    if (!userResponse) {
        throw new ApiError(500, "Something went wrong while creating user");
    }
   return res.status(201).json( new ApiResponse(201, "User created successfully", userResponse));

});

export { registerUser };
