// add js extension while importing to avoid error
import { Router } from "express";
import { logOutUser, loginUser, registerUser } from "../controllers/user.cotroller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// The route method is used to define the route /register, which will handle HTTP POST requests.
// The upload.fields middleware function is used to handle file uploads for the avatar and coverImage fields.
//  It expects an array of objects specifying the field name and the maximum number of files allowed.
// The registerUser function is passed as the final middleware function to handle the HTTP POST request.

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
); // the response is passing to the controller

router.route("/login").post(loginUser);


//secured routes

router.route("/logout").post(verifyToken, logOutUser);

export default router;
