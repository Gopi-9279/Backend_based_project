import { cloudinary } from "../config/cloudinary.config.js";
import fs from "fs"
import { ApiError } from "../utils/ApiError.utils.js";
const uploadOnCloudinary = async(localFilePath) =>{
    try {
        if(!localFilePath) throw new ApiError(404,"local file path not provided")
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type : "auto"
        })
        // file has been succesfully uploaded to cloudinary
        // console.log("file is uploaded on cloudinary",response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        if(localFilePath && fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath)
        } // remove the locally saved tempory file as the upload operation got failed
        throw new ApiError(404,"file not uploded to cloudinary")
    }
}
const destroyfromCloudinary = async(cloudinaryFilePath)=>{
    try{
        if(!cloudinaryFilePath) return new ApiError(400,"cloudinary file path not provided")
        const publicId = cloudinaryFilePath
        .split("/upload/")[1]
        .replace(/^v\d+\//, "")
        .replace(/\.[^/.]+$/, "");
        const response = await cloudinary.uploader.destroy(publicId,{invalidate:true})
        console.log(response)
        return response
    }catch(err){
        console.log("error in removing images from cloudinary",err);
        throw err;
    }
}

export {uploadOnCloudinary,destroyfromCloudinary}