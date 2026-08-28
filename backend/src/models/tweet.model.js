import {Schema,model} from "mongoose";

const tweetSchema = Schema({
    owner : {
        type :Schema.Types.ObjectId,
        ref : "user"
    },
    content :{
        type : String,
        required : true
    }
},{timestamps : true})

const tweetModel = model("tweet",tweetSchema)

export {tweetModel}