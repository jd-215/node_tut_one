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
            const incomingRefreshToken =
                  req.cookies?.refreshToken || req.headers("Authorization")?.replace("Bearer ", "");

            // check if refresh token exists
            if (!incomingRefreshToken) {
                  throw new ApiError(401, "Unauthorized request");
            }
            // verify refresh token
            const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECREAT);
            const user = await User.findById(decoded?._id);

            // check if user exists
            if (!user) {
                  throw new ApiError(401, "Unauthorized request user not found");
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
            throw new ApiError(401, err?.message || "Something went wrong while refreshing access token");
      }
});
      // change current password
const changeCurrentPassword = asyncHandler(async (req, res) => {
      const { oldPassword, newPassword } = req.body; // get the data from the request body
      const user = await User.findById(req.user?._id); // find the user
      const isPasswordCorrect = await user.isPasswordCorrect(oldPassword); // check if old password is correct

      if (!isPasswordCorrect) { // if old password is incorrect
            throw new ApiError(400, "Old password is incorrect");
      }

      user.password = newPassword; // set new password
      await user.save({ validateBeforeSave: false }); // save the user with new password

      return res.status(200).json(new ApiResponse(200, "Password changed successfully", {})); // return success
});

const getCurrentUser = asyncHandler(async (req, res) => {
      // get user from req.user
      return res.status(200).json(new ApiResponse(200, "User fetched successfully", { user: req.user }));
});

// update user
const updateUser = asyncHandler(async (req, res) => {
      const { fullName, userName, email } = req.body; // get the data from the request body
      if (!fullName || !email || !userName) { // check if all values are present or not 
            throw new ApiError(400, "Please provide all values");
      }
      const user = await User.findByIdAndUpdate( //find the user and update the user
            req.user?.id,

            {
                  $set: {
                        fullName,
                        username: userName,
                        email: email,
                  },
            }
      ).select("-password");

      return res.status(200).json(new ApiResponse(200, "User updated successfully", { user }));
});
// update cover image
const updateCoverImage = asyncHandler(async (req, res) => {
      const avatarPath = req.file?.path; // get the path of the uploaded file
      if (!avatarPath) { // check if the file is present or not, if not throw an error as the file is present
            throw new ApiError(400, "Avatar file is missing");
      }
      const newCoverImage = await uploadOnCloudiNary(avatarPath); // upload the file on cloudinary
      if (!newCoverImage.url) { // check if the file url is present or if not throw an error
            throw new ApiError(400, "Something went wrong while uploading the Cover Image file"); 
      }
      const user = await User.findByIdAndUpdate( // update the user cover image
            req.user?.id,
            {
                  $set: {
                        coverImage: newCoverImage.url,
                  },
            },
            { new: true }
      ).select("-password");
      return res.status(200).json(new ApiResponse(200, "User Cover Image updated successfully", { user }));
});
// update avatar image
const updateAvatar = asyncHandler(async (req, res) => {
      const avatarPath = req.file?.path; // get the path of the uploaded file
      if (!avatarPath) { // check if the file is present
            throw new ApiError(400, "Avatar file is missing");
      }
      const newAvatar = await uploadOnCloudiNary(avatarPath); // upload the file on cloudinary
      if (!newAvatar.url) { // check if the file url is present
            throw new ApiError(400, "Something went wrong while uploading the avatar"); 
      }
      // update the user avatar
      const user = await User.findByIdAndUpdate(
            req.user?.id,
            {
                  $set: {
                        avatar: newAvatar.url,
                  },
            },
            { new: true }
      ).select("-password");
      return res.status(200).json(new ApiResponse(200, "User Avatar updated successfully", { user })); // return the response
});

export {
      registerUser,
      loginUser,
      logOutUser,
      refreshAccessToken,
      changeCurrentPassword,
      getCurrentUser,
      updateUser,
      updateCoverImage,
      updateAvatar,
};
