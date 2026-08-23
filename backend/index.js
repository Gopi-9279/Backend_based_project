import app from "./src/app.js";
import { configDotenv } from "dotenv";
configDotenv();
import connectTODB from "./src/config/db.config.js";
const port = process.env.PORT; 
connectTODB()
.then(
    app.listen(port,()=>{
    console.log(`port is listing to port ${port}`)
})
)
.catch(err =>{
    console.log(`error in connection ${err}`)
})





