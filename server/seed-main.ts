import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Adjust this import path to match your project
import { Employee } from './src/models/employee.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('‚ùå MONGODB_URI not set in environment');
  process.exit(1);
}

const departments = [
  'Engineering', 'Sales', 'HR', 'Finance', 'Operations', 
  'Customer Support', 'Marketing', 'Product', 'Design', 'Legal'
];

const locations = ['New York', 'San Francisco', 'Chicago', 'London', 'Toronto', 'Remote', 'Austin', 'Berlin'];

const rolesByDepartment = {
  Engineering: ['Junior Engineer', 'Engineer', 'Senior Engineer', 'Lead Engineer', 'Engineering Manager'],
  Sales: ['SDR', 'Account Executive', 'Senior AE', 'Sales Manager', 'VP Sales'],
  HR: ['HR Coordinator', 'HR Generalist', 'HR Manager', 'HR Director'],
  Finance: ['Financial Analyst', 'Senior Analyst', 'Finance Manager', 'Controller'],
  Operations: ['Ops Analyst', 'Ops Specialist', 'Ops Manager', 'Director Ops'],
  'Customer Support': ['Support Agent', 'Senior Agent', 'Support Lead', 'Support Manager'],
  Marketing: ['Marketing Coordinator', 'Marketing Specialist', 'Marketing Manager', 'Director Marketing'],
  Product: ['Associate PM', 'Product Manager', 'Senior PM', 'Director Product'],
  Design: ['Junior Designer', 'Designer', 'Senior Designer', 'Design Lead'],
  Legal: ['Paralegal', 'Counsel', 'Senior Counsel', 'Legal Director']
};

// Configuration
const TOTAL_EMPLOYEES = 100; // Adjust as needed
const DISTRIBUTION = {
  high: 0.15,   // 15% high risk
  medium: 0.25, // 25% medium risk
  low: 0.60     // 60% low risk
};

// Generate unique data helpers
function generateUniqueEmail(base: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${base}-${timestamp}-${random}@company.com`;
}

function generateEmployeeId(): string {
  return `EMP-${uuidv4().substring(0, 8).toUpperCase()}`;
}

// Risk profile generators
function generateHighRiskProfile(index: number) {
  return {
    performanceRating: 1.2 + (Math.random() * 0.8), // 1.2-2.0
    tenureMonths: Math.floor(Math.random() * 6), // 0-5 months
    engagementScore: 0.1 + (Math.random() * 0.3), // 0.1-0.4
    compRatio: 0.6 + (Math.random() * 0.2), // 0.6-0.8
    skillGapRatio: 0.6 + (Math.random() * 0.4) // 60-100% skills missing
  };
}

function generateMediumRiskProfile(index: number) {
  return {
    performanceRating: 2.5 + (Math.random() * 1.0), // 2.5-3.5
    tenureMonths: 6 + Math.floor(Math.random() * 18), // 6-23 months
    engagementScore: 0.4 + (Math.random() * 0.3), // 0.4-0.7
    compRatio: 0.8 + (Math.random() * 0.2), // 0.8-1.0
    skillGapRatio: 0.2 + (Math.random() * 0.4) // 20-60% skills missing
  };
}

function generateLowRiskProfile(index: number) {
  return {
    performanceRating: 3.5 + (Math.random() * 1.3), // 3.5-4.8
    tenureMonths: 24 + Math.floor(Math.random() * 48), // 24-71 months
    engagementScore: 0.7 + (Math.random() * 0.2), // 0.7-0.9
    compRatio: 1.0 + (Math.random() * 0.3), // 1.0-1.3
    skillGapRatio: Math.random() * 0.2 // 0-20% skills missing
  };
}

// Calculate risk score (simplified version)
function calculateRiskScore(profile: any): number {
  const { performanceRating, tenureMonths, engagementScore, compRatio, skillGapRatio } = profile;
  
  let score = 0;
  
  // Performance (40% weight)
  score += ((5 - performanceRating) / 4) * 40;
  
  // Tenure (20% weight)
  if (tenureMonths < 6) score += 20;
  else if (tenureMonths < 12) score += 15;
  else if (tenureMonths < 24) score += 10;
  else if (tenureMonths < 36) score += 5;
  
  // Engagement (20% weight)
  score += (1 - engagementScore) * 20;
  
  // Compensation (10% weight)
  if (compRatio < 0.7) score += 10;
  else if (compRatio < 0.8) score += 8;
  else if (compRatio < 0.9) score += 5;
  else if (compRatio < 1.0) score += 3;
  
  // Skills (10% weight)
  score += skillGapRatio * 10;
  
  return Math.min(100, Math.max(0, score));
}

function getRiskLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 65) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

// Skill sets
const allSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
  'Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Project Management',
  'Sales', 'Marketing', 'Data Analysis', 'UI/UX Design', 'Customer Service',
  'Financial Modeling', 'HR Compliance', 'Legal Research', 'DevOps'
];

function generateSkills(profile: any) {
  const numSkills = 3 + Math.floor(Math.random() * 4); // 3-6 skills
  const skills: string[] = [];
  
  while (skills.length < numSkills) {
    const skill = allSkills[Math.floor(Math.random() * allSkills.length)];
    if (!skills.includes(skill)) {
      skills.push(skill);
    }
  }
  
  // Determine skill gaps based on risk profile
  const skillGaps: string[] = [];
  const gapRatio = profile.skillGapRatio;
  const numGaps = Math.floor(skills.length * gapRatio);
  
  for (let i = 0; i < numGaps && i < skills.length; i++) {
    skillGaps.push(skills[i]);
  }
  
  return { criticalSkills: skills, skillGaps };
}

async function seed() {
  try {
    console.log('Ìº± Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('‚úÖ MongoDB connected');
    
    // Optional: Clear existing employees (comment out if you want to keep existing data)
    const shouldClear = process.argv.includes('--clear');
    if (shouldClear) {
      console.log('Ì∑π Clearing existing employees collection...');
      await Employee.deleteMany({});
      console.log('‚úÖ Collection cleared');
    }
    
    const employees = [];
    const timestamp = Date.now();
    
    console.log(`\nÌæ≤ Generating ${TOTAL_EMPLOYEES} employees with distribution:`);
    console.log(`   High risk: ${DISTRIBUTION.high * 100}%`);
    console.log(`   Medium risk: ${DISTRIBUTION.medium * 100}%`);
    console.log(`   Low risk: ${DISTRIBUTION.low * 100}%\n`);
    
    for (let i = 0; i < TOTAL_EMPLOYEES; i++) {
      // Determine risk level based on distribution
      let riskProfile;
      let riskLevel: 'high' | 'medium' | 'low';
      
      const rand = i / TOTAL_EMPLOYEES; // Use position for deterministic distribution
      
      if (rand < DISTRIBUTION.high) {
        riskLevel = 'high';
        riskProfile = generateHighRiskProfile(i);
      } else if (rand < DISTRIBUTION.high + DISTRIBUTION.medium) {
        riskLevel = 'medium';
        riskProfile = generateMediumRiskProfile(i);
      } else {
        riskLevel = 'low';
        riskProfile = generateLowRiskProfile(i);
      }
      
      // Calculate risk score
      const riskScore = calculateRiskScore(riskProfile);
      
      // Get department and role
      const department = departments[i % departments.length];
      const roles = (rolesByDepartment as any)[department] || ['Employee'];
      const role = roles[i % roles.length];
      const location = locations[i % locations.length];
      
      // Generate skills
      const { criticalSkills, skillGaps } = generateSkills(riskProfile);
      
      // Generate unique identifiers
      const employeeId = generateEmployeeId();
      const email = generateUniqueEmail(`employee${i + 1}`);
      
      employees.push({
        name: `Employee ${i + 1}`,
        email,
        employeeId,
        department,
        role,
        location,
        tenureMonths: riskProfile.tenureMonths,
        performanceRating: parseFloat(riskProfile.performanceRating.toFixed(2)),
        engagementScore: parseFloat(riskProfile.engagementScore.toFixed(2)),
        compRatio: parseFloat(riskProfile.compRatio.toFixed(2)),
        criticalSkills,
        skillGaps,
        riskScore: parseFloat(riskScore.toFixed(1)),
        riskLevel,
        status: 'Active',
        hireDate: new Date(Date.now() - riskProfile.tenureMonths * 30 * 24 * 60 * 60 * 1000),
        lastAssessmentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Progress indicator
      if ((i + 1) % 20 === 0 || i === TOTAL_EMPLOYEES - 1) {
        console.log(`   Created ${i + 1}/${TOTAL_EMPLOYEES} employees...`);
      }
    }
    
    // Insert employees - use bulk insert for efficiency
    console.log('\nÌ≤æ Saving employees to database...');
    const created = await Employee.insertMany(employees, { ordered: false });
    console.log(`‚úÖ Inserted ${created.length} employees`);
    
    // Show summary
    const distribution = await Employee.aggregate([
      { $group: { _id: "$riskLevel", count: { $sum: 1 } } }
    ]);
    
    console.log('\nÌ≥ä FINAL DISTRIBUTION:');
    distribution.forEach(d => {
      const percentage = ((d.count / TOTAL_EMPLOYEES) * 100).toFixed(1);
      console.log(`   ${d._id.toUpperCase()}: ${d.count} (${percentage}%)`);
    });
    
    // Show sample employees
    console.log('\nÌ±• SAMPLE EMPLOYEES:');
    const samples = await Employee.find().limit(3);
    samples.forEach((emp, idx) => {
      console.log(`\n${idx + 1}. ${emp.name} (${(emp as any).employeeId || "N/A"})`);
      console.log(`   ${emp.department} - ${emp.role}`);
      console.log(`   Risk: ${emp.riskScore}% ‚Üí ${(emp.riskLevel || "unknown").toUpperCase()}`);
      console.log(`   Perf: ${(emp as any).performanceRating || 0}/5.0, Tenure: ${(emp as any).tenureMonths || 0}mo`);
      console.log(`   Email: ${emp.email}`);
    });
    
    await mongoose.disconnect();
    console.log('\nÌ¥å MongoDB disconnected');
    console.log('Ìæâ Seeding complete!');
    
  } catch (err) {
    console.error('‚ùå Error seeding employees:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: tsx seed-employees-dynamic.ts [options]

Options:
  --clear     Clear existing employees before seeding
  --count=N   Number of employees to create (default: 100)
  --help      Show this help message

Example:
  tsx seed-employees-dynamic.ts --clear
  tsx seed-employees-dynamic.ts --count=50
  `);
  process.exit(0);
}

// Parse count argument
const countArg = args.find(arg => arg.startsWith('--count='));
if (countArg) {
  const count = parseInt(countArg.split('=')[1]);
  if (!isNaN(count) && count > 0) {
    (global as any).TOTAL_EMPLOYEES = count;
  }
}

seed();
