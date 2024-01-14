// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";

// const jokes = [
//     { id: 1, title: "Joke 1", content: "This is joke 1" },
//     { id: 2, title: "Joke 2", content: "This is joke 2" },
//     { id: 3, title: "Joke 3", content: "This is joke 3" },
//     { id: 4, title: "Joke 4", content: "This is joke 4" },
// ];
// dotenv.config();
// const port = process.env.PORT;

// const app = express();
// app.use(cors());
// // app.use(express.static('dist'))

// app.get("/", (req, res) => {
//     res.send("hello World.... node server is up and running");
// });
// app.get("/api/jokes", (req, res) => {
//     res.send(jokes);
// });

// app.listen(process.env.PORT, () => {
//     console.log(`example app listening on port ${port}`);
// });

/////////////////////////////////////////////////////////////////////////////////////

import dotenv from "dotenv"
import app from "./app.js"
import connectDB from "./db/dbFile.js"


dotenv.config({ path: "./.env" })

// connectDB()
//     .then(() => {
//     app.listen(process.env.PORT || 8000, () => {
//         console.log(`example app listening on port ${process.env.PORT}`);
//         })
//     })
//     .catch((err) => {
//         console.log(err);
//         process.exit(1);
//     })

// const masterApp = async () => {
//     dotenv.config({ path: "./.env" })
//     connectDB()
//     .then(() => {
//     app.listen(process.env.PORT || 8000, () => {
//         console.log(`App listening on port ${process.env.PORT}`);
//         console.log(" *#* Master app is up and running");
//         })
//     })
//     .catch((err) => {
//         console.log(err);
//         process.exit(1);
//     })
// }

app.listen(process.env.PORT || 8000, () => {
            console.log(`App listening on port ${process.env.PORT}`);
            console.log(" ######################################## ");
            console.log(" ******* Master app is up and running ******* ");
            console.log(" ****                                ****** ");
            console.log("----              J(*O*)J            ---------");
            console.log(" ****                                ****** ");
            console.log(" ######################################## ");
            connectDB().then(() => {
                console.log("DB connected successfully");
            })
            .catch((err) => {
                console.log(err);
                process.exit(1);
            })
            })
        

export default app
