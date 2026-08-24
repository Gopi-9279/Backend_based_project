import { UserRegistration } from "../controllers/user.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
const authRouter = Router();
/**
 * @route POST /api/v1/users/register
 * @description for registering users
 */
authRouter.post("/register",upload.fields([
    {
        name : "avatar",
        maxCount : 1
    },{
        name : "coverImage",
        maxCount : 1
    }
]) ,UserRegistration)



export default authRouter