import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { UserModel } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { uploadOnCloudinary } from "../services/uploadonCloudinary.service.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import jwt from "jsonwebtoken";

const generateAcessAndRefreshToken = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while geneating acess and refresh token"
    );
  }
};

/**
 * @route POST /api/v1/users/register
 * @description for registering users
 */
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
    $or: [{ username }, { email }],
  });
  if (isExistingUser) {
    throw new ApiError(409, "User with email and username already exits");
  }
  //check for images,check for avatar
  const avatarlocalPath = req.files?.avatar[0]?.path;
  // const coverImagelocalPath = req.files?.coverImage[0]?.path;
  let coverImagelocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImagelocalPath = req.files.coverImage[0].path;
  }
  if (!avatarlocalPath) throw new ApiError(400, "avatar file is required");
  const avatar = await uploadOnCloudinary(avatarlocalPath);
  const coverImage = await uploadOnCloudinary(coverImagelocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar file is not uploaded");
  }
  // create user object - create entry in db
  const user = await UserModel.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  // remove password and refresh token field from response
  const createduser = await UserModel.findById(user._id).select(
    "-password -refreshToken"
  );
  // check for user creation
  if (!createduser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  // return user
  return res
    .status(201)
    .json(new ApiResponse(200, createduser, "user registered successfully"));
});
/**
 * @route POST /api/v1/users/login
 * @description for Authenticating user
 */
const UserLoginController = asyncHandler(async (req, res) => {
  /**
   *step 1. req body se content lenge
   *step 2. validate null ko
   *step 3. email se user ko find karenge agar nahi mila to return false kar denge
   *step 4. password check karenge
   *step 5. if password match ho gaya to user ko token de denge
   *step 6. fir login kara denge
   *
   *
   */
  const { email, password } = req.body;
  //validation
  if ([email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  // step 3
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exits here with this email");
  }
  // step 4
  const IspasswordCorrect = await user.IspasswordCorrect(password);
  if (!IspasswordCorrect) {
    throw new ApiError(401, "password is incorrect");
  }
  const { accessToken, refreshToken } = await generateAcessAndRefreshToken(
    user._id
  );

  const loggedInUser = await UserModel.findById(user._id).select(
    "-passwors -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfully"
      )
    );
});
/**
 * @route POST /api/v1/users/logout
 * @description for Logging out
 */
const UserLogoutController = asyncHandler(async (req, res) => {
  await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});
/**
 * @route POST /api/v1/users/refresh-token
 * @description for Accessing refresh token
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await UserModel.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(409, "Unauthorized access , no user found");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token expired or used");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV,
    };
    const { accessToken, newrefreshToken } = await generateAcessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newrefreshToken },
          "Access Token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});
/**
 * @route POST /api/v1/users/update-password
 * @description for changing the password
 */
const UpdatecureentPassword = asyncHandler(async (req, res) => {
  // req body se information lena
  const { oldpassword, newpassword } = req.body;
  // agar info nahi aya to check karna
  if (
    [oldpassword, newpassword].some((field) => !field || field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // check if password is correct or not
  const founduser = await UserModel.findById(req.user?._id);
  // check if password is correct
  const isPasswordCorrect = await founduser.IspasswordCorrect(oldpassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "password incorrect");
  }
  // Update the password
  founduser.password = newpassword;
  await founduser.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully updated the password"));
});
/**
 * @route /api/v1/users/get-profile
 * @description for getting user profile
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user?._id);
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname || !email) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await UserModel.findByIdAndUpdate(
    req,
    user?._id,
    { $set: { fullname, email } },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarlocalPath = req.file?.path;

  if (!avatarlocalPath) {
    throw new ApiError(400, "All fields are Required");
  }
  const avatar = await uploadOnCloudinary(avatarlocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "Not uploaded on cloudinary due to some issue");
  }
  const user = await UserModel.findByIdAndUpdate(
    req.user?._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password");
  
  return res 
  .status(200)
  .json(new ApiResponse(200,user,"Avatar  updated"))
});
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImagelocalPath = req.file?.path;

  if (!coverImagelocalPath) {
    throw new ApiError(400, "All fields are Required");
  }
  const coverImage = await uploadOnCloudinary(coverImagelocalPath);
  if (!coverImage.url) {
    throw new ApiError(400, "Not uploaded on cloudinary due to some issue");
  }
  const user = await UserModel.findByIdAndUpdate(
    req.user?._id,
    { $set: { coverImage : coverImage.url } },
    { new: true }
  ).select("-password");
  
  return res 
  .status(200)
  .json(new ApiResponse(200,user,"cover image updated"))
});

export {
  UserRegistration,
  UserLoginController,
  UserLogoutController,
  refreshAccessToken,
  getCurrentUser,
  UpdatecureentPassword,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage
};
