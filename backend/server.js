import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import User from "./models/User.js";

dotenv.config();

const app = express();

// ----------------------
// ✅ CORS Configuration (Vercel-optimized)
// ----------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://taskmanager-dashboard-vijay.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);

// ----------------------
// Middleware
// ----------------------
app.use(express.json());

// ----------------------
// Test route
// ----------------------
app.get("/api/health", (req, res) => {
  res.json({
    message: "✅ Backend server is running!",
    timestamp: new Date().toISOString(),
  });
});

// ----------------------
// Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ----------------------
// MongoDB connection
// ----------------------
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/taskmanager";

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
};

mongoose
  .connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    createFirstAdmin();
  })
  .catch((err) => {
    console.log("❌ MongoDB connection failed:", err.message);
  });

// ----------------------
// Create first admin user if missing
// ----------------------
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
      console.log("✅ First admin user created");
    }
  } catch (error) {
    console.error("❌ Error creating first admin:", error.message);
  }
};

// ----------------------
// Server start
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ----------------------
// Export for Vercel
// ----------------------
export default app;
