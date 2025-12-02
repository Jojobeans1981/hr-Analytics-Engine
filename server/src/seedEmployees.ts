import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Adjust this import path to match your project
import { Employee } from './models/employee.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in environment');
  process.exit(1);
}

type RiskLevel = 'Low' | 'Medium' | 'High';

const departments = [
  'Engineering',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Customer Support',
  'Marketing',
];

const locations = ['New York', 'San Francisco', 'Chicago', 'London', 'Toronto', 'Remote'];

const rolesByDepartment: Record<string, string[]> = {
  Engineering: ['Engineer', 'Senior Engineer', 'DevOps Engineer'],
  Sales: ['Account Executive', 'Sales Manager'],
  HR: ['HR Generalist', 'HR Manager'],
  Finance: ['Financial Analyst', 'Controller'],
  Operations: ['Operations Analyst', 'Operations Manager'],
  'Customer Support': ['Support Specialist', 'Support Lead'],
  Marketing: ['Marketing Specialist', 'Marketing Manager'],
};

function generateRisk(level: RiskLevel, i: number) {
  if (level === 'High') return 75 + (i % 20);    // 75–94
  if (level === 'Medium') return 45 + (i % 15);  // 45–59
  return 10 + (i % 20);                          // 10–29 (Low)
}

async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

    // DEV ONLY: wipe employees so we never hit unique constraint errors
    await Employee.deleteMany({});
    console.log('🧹 Cleared existing employees collection');

    const employees: any[] = [];
    const totalEmployees = 60; // change if you want more/less
    const timestamp = Date.now();

    for (let i = 0; i < totalEmployees; i++) {
      // Control distribution: ~1/3 high, 1/3 medium, 1/3 low
      let riskLevel: RiskLevel;
      if (i % 3 === 0) riskLevel = 'High';
      else if (i % 3 === 1) riskLevel = 'Medium';
      else riskLevel = 'Low';

      const department = departments[i % departments.length];
      const roles = rolesByDepartment[department] || ['Employee'];
      const role = roles[i % roles.length];
      const location = locations[i % locations.length];

      const riskScore = generateRisk(riskLevel, i);
      const tenureMonths = 3 + (i % 60);
      const performanceRating =
        riskLevel === 'High'
          ? 2 + (i % 10) * 0.1 // worse performance
          : riskLevel === 'Medium'
          ? 3 + (i % 10) * 0.1
          : 4 + (i % 10) * 0.1;

      const idx = i + 1;
      const employeeId = `E${1000 + idx}`; // always unique for this seed
      const email = `user${idx}-${timestamp}@example.com`; // unique each run

      employees.push({
        name: `Test User ${idx}`,
        email,
        employeeId,
        department,
        role,
        location,
        tenureMonths,
        performanceRating,
        riskScore,
        riskLevel,
        status: 'Active',
        lastAssessmentDate: new Date(),
      });
    }

    const created = await Employee.insertMany(employees);
    console.log(`✅ Inserted ${created.length} employees`);

    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding employees:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();