import {Schema,model} from "mongoose";

const SubscriptionSchema = Schema({
    subscriber :{
        type : Schema.Types.ObjectId, //one who is subscribing
        ref : "user"
    },
    channel :{
        type : Schema.Types.ObjectId, //one to whom 'subscriber' is subscribing
        ref : "user"
    }
},{
    timestamps : true
})

const SubscriptionModel = model("subscription",SubscriptionSchema)

export {
    SubscriptionModel
}