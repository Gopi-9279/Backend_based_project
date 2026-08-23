import mongoose, {Schema,model} from "mongoose";
import mongooseAgreegatepaginate from "mongoose-aggregate-paginate-v2"



const VideoSchema = Schema({

    videoFile :{
        type : String,
        required : true
    },
    thumnail :{
        type : String,
        required : true        
    },
    owner :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    title :{
        type : String,
        required : true
    },
    description :{
        type : String,
        required : true
    },
    duration :{
        type : Number,
        required : true
    },
    views :{
        type : Number,
        default : 0
    },
    isPublished :{
        type : Boolean,
        default : true
    }


},{
    timestamps : true
})


VideoSchema.plugin(mongooseAgreegatepaginate)


const VideoModel = model("Video",VideoSchema);

export {VideoModel}