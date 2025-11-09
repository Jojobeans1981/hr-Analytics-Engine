import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import routers (default exports)
import employeeRoutes from "./routes/employees.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API routes

app.get("/api/dashboard-metrics", (_req, res) => {
  console.log("✅ /api/dashboard-metrics called");
  res.json({ 
    totalEmployees: 47,
    activeProjects: 12,
    revenue: 125000,
    growth: 15.3,
    riskLevels: {
      Low: 25,
      Medium: 15,
      High: 7
    }
  });
});

app.use("/api/employees", employeeRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the future of Human Resource Management, Prometheus talent risk engine 🚀" });
});

// Config
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || "";
const DB_NAME = process.env.MONGO_DB_NAME || undefined; // optional if you break DB name out

async function startServer() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, DB_NAME ? { dbName: DB_NAME } : undefined);

    console.log("✅ Connected to MongoDB:", mongoose.connection.db.databaseName);

    app.listen(PORT, () => {
      console.log(`🚀 Server live at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
}

startServer();