import * as express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cors from "cors";
import employeesRouter from "./routes/employee.routes";

dotenv.config();

const app = express();

// CORS configuration for specific frontend domains
app.use(cors({
  origin: [
    'https://dashboard-new-eta-blond.vercel.app', // Your Vercel frontend
    'http://localhost:3000', // Local development
    'http://localhost:5173'  // Vite development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use("/api/employees", employeesRouter);

// Demo route
app.get("/", (_req, res) => {
  res.json({ message: "🚀 Talent Risk API running with ESM + TSX" });
});

// Dashboard metrics route
app.get("/api/dashboard-metrics", async (req, res) => {
  try {
    // Your dashboard metrics logic here
    res.json({ 
      message: "Dashboard metrics data",
      totalEmployees: 150,
      activeProjects: 12,
      riskScore: 7.2
      // Add your actual metrics data
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({ error: "Failed to fetch dashboard metrics" });
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || "";

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    console.log("📌 Connected DB Name:", mongoose.connection.db?.databaseName);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error", err);
  });

export default app;