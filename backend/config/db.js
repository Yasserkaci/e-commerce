import mongoose from "mongoose";
import "dotenv/config";

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Database connected successfully!");
  } catch (error) {
    console.log(`ERROR: ${error}`);
    process.exit(1);
  }
};

export default connectdb
