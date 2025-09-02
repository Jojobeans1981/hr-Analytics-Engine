
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Demo route
app.get("/", (_req, res) => {
  res.json({ message: "��� Talent Risk API running with ESM + TSX" });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || "";

mongoose.connect(MONGO_URI).then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => console.log(`��� Server live on port ${PORT}`));
}).catch((err) => {
  console.error("❌ MongoDB Error", err);
});
