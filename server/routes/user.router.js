// add js extension while importing to avoid error
import { Router } from "express";
import {
      logOutUser,
      loginUser,
      registerUser,
      refreshAccessToken,
      changeCurrentPassword,
      getCurrentUser,
      updateUser,
      updateCoverImage,
      updateAvatar,
      getWatchHistory,
      getUserChannelProfile,
} from "../controllers/user.cotroller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verify_DB_Connection } from "../middlewares/db.middleware.js";

const router = Router();

// The route method is used to define the route /register, which will handle HTTP POST requests.
// The upload.fields middleware function is used to handle file uploads for the avatar and coverImage fields.
//  It expects an array of objects specifying the field name and the maximum number of files allowed.
// The registerUser function is passed as the final middleware function to handle the HTTP POST request.

router.route("/register").post(      upload.fields([
            { name: "avatar", maxCount: 1 },
            { name: "coverImage", maxCount: 1 },
      ]),
      registerUser
); // the response is passing to the controller

router.route("/login").post(loginUser);

//secured routes or protected routes

router.route("/logout").post(verifyToken, logOutUser); // the response is passing by middleware and then to the controller

router.route("/refresh-token").post( refreshAccessToken); // the routes are refreshing the access token

router.route("/change-password").post( verifyToken, changeCurrentPassword);

router.route("/current-user").get(  verifyToken, getCurrentUser);

router.route("/update-user").post(verifyToken, upload.single("avatar"), updateUser);

router.route("/update-cover-image").post(
            verifyToken,
      upload.single("coverImage"),
      updateCoverImage
);

router.route("/update-avatar").post( verifyToken, upload.single("avatar"), updateAvatar);

router.route("/c/:username").get( verifyToken, getUserChannelProfile);

router.route("/watch-history").get( verifyToken, getWatchHistory);

// exporting the router

// router.route("/hello").get( async (req, res) => {res.send("hello")});

 // exporting the router

export default router;
