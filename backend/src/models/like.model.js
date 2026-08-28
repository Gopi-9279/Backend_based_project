import {Schema,model} from "mongoose";

const likeSchema = Schema({
    comment : {
        type : Schema.Types.ObjectId,
        ref : "comment"
    },
    vidoe :{
        type : Schema.Types.ObjectId,
        ref : "Video"
    },
    likedBy :{
        type : Schema.Types.ObjectId,
        ref : "user"
    },
    tweet : {
        type : Schema.Types.ObjectId,
        ref : "tweet"
    }
},{
    timestamps : true
})

const likeModel = model("like",likeSchema)

export {likeModel}