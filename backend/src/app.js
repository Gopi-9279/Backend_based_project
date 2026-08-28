import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))
/**
 * @description Middlewares
 */
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


/**
 * @description acquire routes
 */
import authRouter from "./routes/user.routes.js";
import {router as VieoRouter} from "./routes/video.routes.js";
/**
 * @description using prefix
 */
app.use("/api/v1/users",authRouter);
app.use("/api/v1/videos",VieoRouter);

export default app;