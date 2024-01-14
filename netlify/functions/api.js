// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express, { Router } from "express";
import serverless from "serverless-http";
// import masterApp from "../../server";
import app from "../../server";

const router = Router();
dotenv.config({ path: "./.env" });
// router.get("/hello", (req, res) => res.send("Hello World!"));

api.use("/api/", router);

// export const handler = serverless(api);
// connectDB()
export const handler = serverless(masterApp);
