import { cloudinary } from "../config/cloudinary.config.js";
import fs from "fs"
const uploadOnCloudinary = async(localFilePath) =>{
    try {
        if(!localFilePath) return null
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
        return null
    }
}

export {uploadOnCloudinary}