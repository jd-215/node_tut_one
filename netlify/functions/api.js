// YOUR_BASE_DIRECTORY/netlify/functions/api.ts
import dotenv from "dotenv";
import serverless from "serverless-http";
// import masterApp from "../../server";
import app from "../../server";

dotenv.config({ path: "./.env" });
// router.get("/hello", (req, res) => res.send("Hello World!"));

// export const handler = serverless(api);
// connectDB()
export const handler = serverless(app);
