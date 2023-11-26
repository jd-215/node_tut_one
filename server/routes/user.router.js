import { Router } from "express";
import { registerUser } from "../controllers/user.cotroller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
); // the response is passing to the controller

export default router;
