import multer from "multer"
/**
 * @description this is multer middleware for local file handling and url 
 */
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,"./public/temp")
    },
    filename : function (req,file,cb){
        cb(null,file.originalname)
    }
})

export const upload = multer({storage : storage})