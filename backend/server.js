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
// ✅ CORS Configuration
// ----------------------

// Define allowed origins for different environments
const allowedOrigins = [
  "http://localhost:5173", // Local frontend (Vite)
  "https://taskmanager-dashboard-vijay.netlify.app", // Deployed frontend
];

// 1️⃣ Basic CORS middleware (Vercel-compatible)
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// 2️⃣ Manual CORS headers for OPTIONS preflight (important for Vercel)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

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
    console.log("Please make sure MongoDB is running on your system");
    console.log(
      "You can start MongoDB with: mongod --dbpath=/path/to/your/data/directory"
    );
  });

// ----------------------
// MongoDB event handlers
// ----------------------
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// ----------------------
// Create first admin user if missing
// ----------------------
const createFirstAdmin = async () => {
  try {
    console.log("Checking for admin user...");
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      console.log("Creating first admin user...");
      await User.create({
        name: "System Administrator",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      });
      console.log("✅ First admin user created successfully");
      console.log("📧 Email: admin@example.com");
      console.log("🔑 Password: admin123");
    } else {
      console.log("✅ Admin user already exists");
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
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});

// ----------------------
// Graceful shutdown
// ----------------------
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});
