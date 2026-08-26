import { UserModel } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import jwt from "jsonwebtoken"
/**
 * @description for checking wheather the user is logged in or not and checking for id in token
 */

export const authMiddleware = asyncHandler(async(req,_,next)=>{
    try {
  
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
  
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await UserModel.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user) {throw new ApiError(401,"Invalid Access token")}
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
    }
})