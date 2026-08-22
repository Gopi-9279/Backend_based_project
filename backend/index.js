import app from "./src/app.js";
import { configDotenv } from "dotenv";
configDotenv();
import connectTODB from "./src/config/db.config.js";
connectTODB();





const port = process.env.PORT; 
app.listen(port,()=>{
    console.log(`port is listing to port ${port}`)
})