import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });

    console.log("Cloudinary upload successful:", response.secure_url);

    // Cloudinary image URL return করবে
    return response.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed!");
    console.error("Error message:", error.message);
    console.error("HTTP status:", error.http_code);

    return null;
  }
};

export default uploadOnCloudary;
