//Database,mongoose connection
import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connect DB");
  } catch (error) {
    console.log("Db Error",error.message);
  }
};
export default connectDb;
