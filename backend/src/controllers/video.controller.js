import mongoose, {isValidObjectId} from "mongoose"
import {VideoModel} from "../models/video.models.js"
import {UserModel} from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.utils.js"
import { ApiResponse } from "../utils/ApiResponse.utils.js"
import { asyncHandler } from "../utils/asyncHandler.utils.js"
import { uploadOnCloudinary,destroyfromCloudinary } from "../services/uploadonCloudinary.service.js"

/**
 * @description TODO: get all videos based on query, sort, pagination
 */
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    

})
/**
 * @description // TODO: 1. get video, 2. upload to cloudinary, 3.create video
 */
const publishAVideo = asyncHandler(async (req, res) => {
      
    const { title, description} = req.body
    // getting video
    const videoFile = req.files?.videoFile[0]?.path;
    const thumbnail = req.files?.thumbnail[0]?.path;
    // checking if all fields are present or not
    if ([title?.trim(),description?.trim(),videoFile,thumbnail].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    // upload files to cloudinary
    const uploadVideoFile = await uploadOnCloudinary(videoFile)
    const uploadThumbnail = await uploadOnCloudinary(thumbnail)
    console.log(uploadVideoFile)
    console.log(uploadThumbnail)
    const user = await UserModel.findById(req.user?._id);
    // creating video 
    const video = VideoModel.create({
        videoFile : uploadVideoFile?.secure_url,
        thumnail : uploadThumbnail?.secure_url,
        owner : user,
        title : title?.trim(),
        description : description?.trim(),
        duration : uploadVideoFile.duration,
        views : 0,
        isPublished : true
    })
    return res 
    .status(200)
    .json(new ApiResponse(200,video,"video published successfully"))



})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await VideoModel.findById(videoId)
    if(!video){
        throw new ApiError(400,"video not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,"video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title,description} = req.body;
    const {thumnail} = req.file?.path;
    //TODO: update video details like title, description, thumbnail
    if ([title?.trim(), description?.trim(),thumnail].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    const video = await VideoModel.findById(videoId)
    const uploadThumbnailOnCloudinary = await uploadOnCloudinary(thumnail);
    const newthumbnail = uploadThumbnailOnCloudinary?.secure_url;
    const updateVideo = await VideoModel.findByIdAndUpdate(
        videoId,
        {
            $set :{
                title : title?.trim(),
                description : description?.trim(),
                thumbnail : newthumbnail
            }
        },{
            new : true
        }
    )
    const thumnailCloudinaryUrl = video.thumnail;
    destroyfromCloudinary(thumnailCloudinaryUrl);
    return res 
    .status(200)
    .json(new ApiResponse(200,updateVideo,"video updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const deleteVideo = await VideoModel.findByIdAndDelete(videoId)
    if(!deleteVideo){
        throw new ApiError(400,"video not deleted might be wrong id")
    }
    return res
    .status(200)
    .json(200,deleteVideo,"video deleted successfully")
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}