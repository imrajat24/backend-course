import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (path) => {
  if (!path) null;
  try {
    // uploading the file on cloudinary
    const response = await cloudinary.uploader.upload(path);
    // file uploaded successfuly
    console.log("File upload successful:", response.url);
    return response;
  } catch (err) {
    fs.unlinkSync(path);
    return null;
  }
};

export { uploadOnCloudinary };
