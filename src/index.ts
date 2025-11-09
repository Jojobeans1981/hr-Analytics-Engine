import * as express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cors from "cors";
import employeesRouter from "./routes/employee.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/employees", employeesRouter);

// Demo route
app.get("/", (_req, res) => {
  res.json({ message: "🚀 Talent Risk API running with ESM + TSX" });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || "";

mongoose.connect(MONGO_URI)
console.log("📌 Connected DB Name:", mongoose.connection.db.databaseName);
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error", err);
  });
