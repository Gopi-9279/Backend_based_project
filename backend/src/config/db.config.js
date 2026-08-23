import { json } from "express";
import mongoose from "mongoose";


const connectTODB = async () =>{
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Sucessfully connected to database !! DB HOST: ${connectionInstance.connection.host}`);
        
    }
    catch(err){
      console.log("There is an error while connecting : ",err);
        process.exit(1)
    }
}

export default connectTODB;