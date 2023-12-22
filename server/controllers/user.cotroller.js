import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/users/user.model.js";
import { uploadOnCloudiNary } from "../utils/cloudinary.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

import jwt from "jsonwebtoken";

// This function generates an access and refresh token for a user
const generateAccessAndRefreshToken = async (user) => {
      // generate access and refresh token
      // save refresh token in db
      // return access and refresh token

      try {
            // generate access and refresh token
            const accessToken = await user.generateAccessToken(user._id);
            const refreshToken = await user.generateRefreshToken(user._id);

            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });

            return { accessToken, refreshToken };
      } catch (err) {
            throw new ApiError(500, "Something went wrong while generating access and refresh token");
      }
};

// This function registers a user

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

      //validation - not empty
      if (
            [username, email, password, fullName].some(
                  //check if all fields are empty or not
                  (field) => field?.trim() === ""
            )
      ) {
            throw new ApiError(400, "All fields are required");
      }

      const existingUser = await User.findOne({ $or: [{ username }, { email }] }); //check if user already exists with this email or username in db
      if (existingUser) {
            throw new ApiError(409, "User already exists with this email or username");
      }
      const avatarLocalPath = req.files?.avatar[0]?.path;
      console.log("file details", req.files);
      console.log("file details", req.files?.avatar[0]?.path);
      const coverImageLocalPath = req.files?.coverImage[0]?.path;
      console.log("file details local path =", avatarLocalPath, coverImageLocalPath);

      if (!avatarLocalPath) throw new ApiError(400, "avatar is required");
      if (!coverImageLocalPath) throw new ApiError(400, "coverImage is required");

      const avatarUrl = await uploadOnCloudiNary(avatarLocalPath);
      const coverImageUrl = await uploadOnCloudiNary(coverImageLocalPath);

      const user = await User.create({
            username,
            email,
            password,
            fullName,
            avatar: avatarUrl || "",
            coverImage: coverImageUrl || "",
      });
      const userResponse = await User.findById(user._id).select("-password -refreshToken");
      if (!userResponse) {
            throw new ApiError(500, "Something went wrong while creating user");
      }
      return res.status(201).json(new ApiResponse(201, "User created successfully", userResponse));
});

// This function logs in a user
const loginUser = asyncHandler(async (req, res) => {
      // get authenticated from user by username and password from request body
      // check if user exists
      // generate access token
      // generate refresh token
      // save refresh token in db
      // return access token
      // send secure cookies with refresh token and access token

      const { username, password, email } = req.body;
      if (!username && !email) {
            throw new ApiError(400, "username or email is required");
      }
      const user = await User.findOne({ $or: [{ username }, { email }] }); // check if user exists with username or email in db
      if (!user) {
            throw new ApiError(404, "User not found");
      }

      const isPasswordValid = await user.isPasswordCorrect(password);

      if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials");
      }
      // generate access and refresh token
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);
      // save refresh token in db
      const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
      // return access and refresh token
      const options = {
            //modified from server cookies
            httpOnly: true,
            secure: true,
            sameSite: "none",
      };

      return (
            res
                  // return access and refresh token
                  .status(200)
                  .cookie("accessToken", accessToken, options) // send secure cookies with refresh token and access token
                  .cookie("refreshToken", refreshToken, options)
                  .json(
                        new ApiResponse(200, "User logged in successfully", {
                              user: loggedInUser,
                              accessToken: accessToken,
                              refreshToken: refreshToken,
                        })
                  )
      );
});
// This function logs out a user
const logOutUser = asyncHandler(async (req, res) => {
      try {
            const userId = req.user._id;
            const user = await User.findOneAndUpdate(
                  { _id: userId },
                  { $set: { refreshToken: undefined } },
                  { new: true }
            );

            const options = {
                  //modified from server cookies
                  httpOnly: true,
                  secure: true,
                  sameSite: "none",
            };
            if (user) {
                  return res
                        .status(200)
                        .clearCookie("accessToken", options)
                        .clearCookie("refreshToken", options)
                        .json(new ApiResponse(200, "User logged out successfully", {}));
            }
      } catch (err) {
            throw new ApiError(500, "Something went wrong while logging out user");
      }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
      try {
            // get refresh token from cookies
            const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
            if (incomingRefreshToken) {
                  throw new ApiError(401, "Unauthorized request");
            }
            // verify refresh token
            const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECREAT);
            const user = await User.findById(decoded?._id);

            // check if user exists
            if (!user) {
                  throw new ApiError(401, "Unauthorized request");
            }
            // check if refresh token is valid
            if (incomingRefreshToken !== user?.refreshToken) {
                  throw new ApiError(401, "Request is expired");
            }
            // generate access and refresh token

            const options = {
                  httpOnly: true,
                  secure: true,
            };

            const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user); // generate access and refresh token
            // return access and refresh token
            return res
                  .status(200)
                  .cookie("accessToken", accessToken, options)
                  .cookie("refreshToken", refreshToken, options)
                  .json(
                        new ApiResponse(200, "Access token refreshed successfully", {
                              accessToken: accessToken,
                              refreshToken,
                        })
                  );
      } catch (err) {
            throw new ApiError(401,err?.message || "Something went wrong while refreshing access token");
      }
});

export { registerUser, loginUser, logOutUser, refreshAccessToken };
