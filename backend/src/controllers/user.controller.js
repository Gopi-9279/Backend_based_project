import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { UserModel } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { uploadOnCloudinary } from "../services/uploadonCloudinary.service.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
const UserRegistration = asyncHandler(async (req, res) => {

  // get user details from frontend
  const { username, email, password, fullname } = req.body;

  //validation
  if (
  [username, email, password, fullname].some(
    (field) => !field || field.trim() === ""
  )
) {
  throw new ApiError(400, "All fields are required");
}
  
  //check if user already exits : email
  const isExistingUser = await UserModel.findOne({
    $or : [{username},{email}]
  })
  if(isExistingUser){
    throw new ApiError(409,"User with email and username already exits")
  }
  //check for images,check for avatar
  const avatarlocalPath = req.files?.avatar[0]?.path
  // const coverImagelocalPath = req.files?.coverImage[0]?.path;
  let coverImagelocalPath ;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ){
    coverImagelocalPath = req.files.coverImage[0].path;
  }
  if(!avatarlocalPath) throw new ApiError(400,"avatar file is required")
  const avatar = await uploadOnCloudinary(avatarlocalPath)
  const coverImage = await uploadOnCloudinary(coverImagelocalPath)
  
  
  if(!avatar){
    throw new ApiError(400,"avatar file is not uploaded")
  }
  // create user object - create entry in db 
  const user = await UserModel.create({
    fullname,
    avatar : avatar.url,
    coverImage : coverImage?.url || "",
    email,
    password,
    username : username.toLowerCase()
  })
  // remove password and refresh token field from response
  const createduser = await UserModel.findById(user._id).select(
    "-password -refreshToken"
  )
  // check for user creation
  if(!createduser){
    throw new ApiError(500,"Something went wrong while registering the user")
  }
  // return user
  return res.status(201).json(
    new ApiResponse(200,createduser,"user registered successfully")
  )

});

export { UserRegistration };
