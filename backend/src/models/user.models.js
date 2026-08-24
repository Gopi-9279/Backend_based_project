import mongoose,{Schema ,model,} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"


const UserSchema = Schema({
    username :{
        type : String,
        required : [true,"Username is required "],
        unique : [true,"Username already exits"],
        lowercase : true,
        minLength : [3,"usrname must be atleast 3 characters"],
        maxLength : [12,"username must be atmost 12 characters"],
        trim : true,
        index : true
    },
    email :{
        type : String,
        required : [true,"email is required "],
        unique : [true,"email already exits"],
        lowercase : true,
        trim : true

    },
    fullname :{
        type : String,
        required : [true,"fullName is required "],
        trim : true,
        index : true
    },
    password :{
        type : String,
        required : [true,"password is required"],

    },
    avatar:{
        type : String, //cloudinary service
        required : true
    },
    coverImage :{
        type : String //cloudinary url
    },
    watchHistory :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    refreshToken :{
        type : String
    }
},{
    timestamps : true
})


UserSchema.pre('save', async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10)

})

UserSchema.methods.IspasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullName : this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}

const UserModel = model("user",UserSchema);

export {UserModel}