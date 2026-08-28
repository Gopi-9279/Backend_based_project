import {Schema,model} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = Schema({
    content : {
        type : String,
        required : [true,"content is required"]
    },
    video :{
            type : Schema.Types.ObjectId,
            ref : "Video"
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "user"
    }
},{
    timestamps : true
})

commentSchema.plugin(mongooseAggregatePaginate)
const commentModel = model("comment",commentSchema)

export {commentModel}