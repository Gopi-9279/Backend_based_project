import { UserLoginController, UserLogoutController, UserRegistration , refreshAccessToken} from "../controllers/user.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
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

/**
 * @route POST /api/v1/users/login
 * @description for Authenticating user
 */
authRouter.post("/login",UserLoginController)
/**
 * @route POST /api/v1/users/logout
 * @description for logging out
 */
authRouter.post("/logout",authMiddleware,UserLogoutController)


authRouter.post("/refresh-token",refreshAccessToken)
export default authRouter
