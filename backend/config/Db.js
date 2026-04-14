import mongoose from "mongoose";
import { ENV_VARS } from "./envVar.js";

export const connectDB = async () => {
  try {
    if (process.env.SKIP_DB === "true") {
      console.log("Database connection skipped");
      return;
    }

    await mongoose.connect(ENV_VARS.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};