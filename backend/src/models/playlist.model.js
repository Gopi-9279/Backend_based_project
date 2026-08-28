import {Schema,model} from "mongoose";

const playListSchema = Schema({
    name  : {
        type : String ,
        required : true
    },
    description : {
        type : String ,
    },
    video :[ 
        {
            type : Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "user"
    }
},{
    timestamps : true
})

const playListModel = model("playList",playListSchema)

export {playListModel}
