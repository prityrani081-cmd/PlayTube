import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./route/authRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// .env file থেকে environment variables load করা
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Frontend-এর সঙ্গে backend connection configure করা
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Authentication routes
app.use("/api/auth", authRouter);

// Server start এবং database connection
const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
