import {v2 as cloudinary} from 'cloudinary';

import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudiNary = async (localFilePath) => {
    // return new Promise((resolve, reject) => {
    //     cloudinary.v2.uploader.upload(filePath, (error, result) => {
    //         if (error) {
    //             reject(error);
    //         } else {
    //             resolve(result);
    //         }
    //     });
    // });
    try {
        if (!localFilePath) return null;
        // upload to cloudinary
       const response = await cloudinary.uploader.upload(localFilePath,{
          resource_type: "auto",
        })
        console.log("file uploaded successfully", response.url);
        return response.url
    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath); // delete local file after error happens

        return null;
    }
};

export { uploadOnCloudiNary };
