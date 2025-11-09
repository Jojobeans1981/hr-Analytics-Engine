// seed.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Employee } from "./models/employee.model.js"; // adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "";
// Explicitly set your DB name (to match API) — lowercase recommended
const DB_NAME = process.env.MONGO_DB_NAME || "Prometheus";

async function seed() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, { dbName: DB_NAME });

    console.log("✅ Connected to MongoDB:", mongoose.connection.db.databaseName);

    // Clear existing employees (optional, ensure unique emails)
    await Employee.deleteMany({});
    console.log("🧹 Cleared existing employees collection");

    // Insert sample employees
    const employees = [
      {
        name: "Alice Johnson",
        role: "Software Engineer",
        email: "alice.johnson@example.com",
        department: "Engineering",
        riskScore: 0.25,
      },
      {
        name: "Bob Smith",
        role: "Marketing Manager",
        email: "bob.smith@example.com",
        department: "Marketing",
        riskScore: 0.5,
      },
      {
        name: "Charlie Brown",
        role: "HR Specialist",
        email: "charlie.brown@example.com",
        department: "HR",
        riskScore: 0.35,
      },
      {
        name: "Diana Prince",
        role: "Financial Analyst",
        email: "diana.prince@example.com",
        department: "Finance",
        riskScore: 0.72,
      },
      {
        name: "Ethan Hunt",
        role: "DevOps Engineer",
        email: "ethan.hunt@example.com",
        department: "Engineering",
        riskScore: 0.85,
      },
    ];

    await Employee.insertMany(employees);
    console.log("🌱 Seeded employees:", employees.length);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();