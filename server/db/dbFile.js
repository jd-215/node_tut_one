import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";

import process from "process";


const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}?retryWrites=true&w=majority`);
        // console.log(connectionInstance);
        //  console.log("Connected to MongoDB on ", connectionInstance.connection.host, connectionInstance.connection.name);
         console.log("Connected to DB");
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }

    // console.log("url", process.env.MONGO_URL);
}

export default connectDB