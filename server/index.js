import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const jokes = [
    { id: 1, title: "Joke 1", content: "This is joke 1" },
    { id: 2, title: "Joke 2", content: "This is joke 2" },
    { id: 3, title: "Joke 3", content: "This is joke 3" },
    { id: 4, title: "Joke 4", content: "This is joke 4" },
];
dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(cors());
// app.use(express.static('dist'))

app.get("/", (req, res) => {
    res.send("hello World.... node server is up and running");
});
app.get("/api/jokes", (req, res) => {
    res.send(jokes);
});

app.listen(process.env.PORT, () => {
    console.log(`example app listening on port ${port}`);
});
