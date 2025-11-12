import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import User from "./models/User.js";

dotenv.config();

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://taskmanager-dashboard-vijay.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/taskmanager";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    createFirstAdmin();
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err.message);
  });

const createFirstAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      await User.create({
        name: "System Administrator",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      });
      console.log("Admin user created");
    }
  } catch (error) {
    console.error("Error creating admin:", error.message);
  }
};

export default app;
