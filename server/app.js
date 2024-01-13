// default initializations

import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// app configurations

const app = express()

app.use(cors({
        origin:process.env.CORS_ORIGIN,
        credentials:true
}))
app.use(express.json({limit:"1031kb"}))
app.use(urlencoded({extended:true, limit:"100kb"}))
// app.use(express.static("public"))
app.use(cookieParser())


// routes imports configurations

import userRouter from "./routes/user.router.js"

// routes declaration

app.use("/api/v1/users", userRouter)



export default app 
