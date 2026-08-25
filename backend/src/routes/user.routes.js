import { UpdatecureentPassword, UserLoginController, UserLogoutController, UserRegistration , getCurrentUser, refreshAccessToken} from "../controllers/user.controller.js";
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
/**
 * @route POST /api/v1/users/refresh-token
 * @description for refresh Token 
 */
authRouter.post("/refresh-token",refreshAccessToken)
/**
 * @route POST /api/v1/users/update-password
 * @description for updating the current user password
 */ 
authRouter.post("/update-password",authMiddleware,UpdatecureentPassword)
/**
 * @route GET /api/v1/users/get-user
 * @description for getting user profile
 */
authRouter.get("get-profile",authMiddleware,getCurrentUser)
export default authRouter
