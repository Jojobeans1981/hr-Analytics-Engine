import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Employee } from './src/models/employee.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('‚ùå MONGODB_URI not set in environment');
  process.exit(1);
}

async function seed() {
  try {
    console.log('Ìº± SEEDING EMPLOYEES');
    console.log('====================\n');
    
    // Connect
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('‚úÖ Connected to MongoDB');
    
    // Clear existing (optional)
    const shouldClear = process.argv.includes('--clear');
    if (shouldClear) {
      console.log('Ì∑π Clearing existing employees...');
      await Employee.deleteMany({});
      console.log('‚úÖ Collection cleared');
    }
    
    const count = 60; // Number of employees to create
    const employees = [];
    
    console.log(`\nÌæ≤ Generating ${count} employees...\n`);
    
    const departments = ['Engineering', 'Sales', 'HR', 'Finance', 'Marketing', 'Operations'];
    const locations = ['New York', 'San Francisco', 'Remote', 'Chicago', 'London'];
    
    for (let i = 1; i <= count; i++) {
      // Risk distribution (15% high, 25% medium, 60% low)
      let riskLevel: 'high' | 'medium' | 'low';
      let performanceRating: number;
      let tenureMonths: number;
      let engagementScore: number;
      let compRatio: number;
      
      const position = i / count; // 0.016, 0.033, ..., 1.0
      
      if (position <= 0.15) {
        riskLevel = 'high';
        performanceRating = 1.2 + Math.random() * 0.8; // 1.2-2.0
        tenureMonths = Math.floor(Math.random() * 6); // 0-5 months
        engagementScore = 0.1 + Math.random() * 0.3; // 0.1-0.4
        compRatio = 0.6 + Math.random() * 0.2; // 0.6-0.8
      } else if (position <= 0.40) {
        riskLevel = 'medium';
        performanceRating = 2.5 + Math.random() * 1.0; // 2.5-3.5
        tenureMonths = 6 + Math.floor(Math.random() * 18); // 6-23 months
        engagementScore = 0.4 + Math.random() * 0.3; // 0.4-0.7
        compRatio = 0.8 + Math.random() * 0.2; // 0.8-1.0
      } else {
        riskLevel = 'low';
        performanceRating = 3.5 + Math.random() * 1.3; // 3.5-4.8
        tenureMonths = 24 + Math.floor(Math.random() * 48); // 24-71 months
        engagementScore = 0.7 + Math.random() * 0.2; // 0.7-0.9
        compRatio = 1.0 + Math.random() * 0.3; // 1.0-1.3
      }
      
      // Calculate risk score using your TalentRiskAssessor logic
      let riskScore = 0;
      
      // Performance (matches your calculatePerformanceRisk)
      riskScore += ((5 - performanceRating) / 4) * 35; // 35% weight
      
      // Tenure (matches your calculateTenureRisk)
      if (tenureMonths < 6) riskScore += 15; // 15% weight (0.15)
      else if (tenureMonths < 12) riskScore += 9;
      else if (tenureMonths < 24) riskScore += 4.5;
      else if (tenureMonths < 60) riskScore += 2.25;
      else riskScore += 0.75;
      
      // Engagement (matches your calculateEngagementRisk)
      riskScore += (1 - engagementScore) * 25; // 25% weight
      
      // Compensation (matches your calculateCompensationRisk)
      if (compRatio < 0.7) riskScore += 13.5; // 15% weight (0.15 * 0.9)
      else if (compRatio < 0.8) riskScore += 10.5;
      else if (compRatio < 0.9) riskScore += 7.5;
      else if (compRatio <= 1.1) riskScore += 3;
      else if (compRatio <= 1.3) riskScore += 1.5;
      else riskScore += 0.75;
      
      // Skills (10% weight - assuming no skill gaps for simplicity)
      // You can add skill logic here if needed
      
      riskScore = Math.min(100, Math.max(0, Math.round(riskScore * 10) / 10));
      
      // Department and role
      const department = departments[i % departments.length];
      const roles = {
        Engineering: ['Junior Engineer', 'Engineer', 'Senior Engineer', 'Tech Lead'],
        Sales: ['SDR', 'Account Executive', 'Senior AE', 'Sales Manager'],
        HR: ['HR Coordinator', 'HR Generalist', 'HR Manager', 'HR Director'],
        Finance: ['Financial Analyst', 'Senior Analyst', 'Finance Manager', 'Controller'],
        Marketing: ['Marketing Coordinator', 'Marketing Specialist', 'Marketing Manager', 'Director'],
        Operations: ['Ops Analyst', 'Ops Specialist', 'Ops Manager', 'Director Ops']
      };
      
      const roleOptions = roles[department as keyof typeof roles] || ['Employee'];
      const role = roleOptions[i % roleOptions.length];
      const location = locations[i % locations.length];
      
      // Generate unique email
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const email = `employee${i}-${timestamp}-${randomStr}@company.com`;
      
      employees.push({
        name: `Employee ${i}`,
        email,
        employeeId: `EMP${1000 + i}`,
        department,
        role,
        location,
        tenureMonths,
        performanceRating: parseFloat(performanceRating.toFixed(2)),
        engagementScore: parseFloat(engagementScore.toFixed(2)),
        compRatio: parseFloat(compRatio.toFixed(2)),
        criticalSkills: ['Communication', 'Teamwork', 'Problem Solving'],
        skillGaps: riskLevel === 'high' ? ['Communication', 'Teamwork'] : 
                   riskLevel === 'medium' ? ['Communication'] : [],
        riskScore,
        riskLevel,
        status: 'Active' as const,
        hireDate: new Date(Date.now() - tenureMonths * 30 * 24 * 60 * 60 * 1000),
        lastAssessmentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Progress indicator
      if (i % 10 === 0) {
        console.log(`   Created ${i}/${count} employees...`);
      }
    }
    
    // Insert into database
    console.log('\nÌ≤æ Saving employees to database...');
    const created = await Employee.insertMany(employees);
    console.log(`‚úÖ Inserted ${created.length} employees`);
    
    // Show distribution
    console.log('\nÌ≥ä RISK DISTRIBUTION:');
    const distribution = await Employee.aggregate([
      { $group: { _id: "$riskLevel", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    distribution.forEach(d => {
      const percentage = ((d.count / count) * 100).toFixed(1);
      console.log(`   ${d._id.toUpperCase()}: ${d.count} (${percentage}%)`);
    });
    
    // Show statistics
    const stats = await Employee.aggregate([
      {
        $group: {
          _id: null,
          avgRiskScore: { $avg: "$riskScore" },
          avgPerformance: { $avg: "$performanceRating" },
          avgTenure: { $avg: "$tenureMonths" }
        }
      }
    ]);
    
    if (stats[0]) {
      console.log('\nÌ≥à STATISTICS:');
      console.log(`   Average Risk Score: ${stats[0].avgRiskScore.toFixed(1)}%`);
      console.log(`   Average Performance: ${stats[0].avgPerformance.toFixed(2)}/5.0`);
      console.log(`   Average Tenure: ${stats[0].avgTenure.toFixed(1)} months`);
    }
    
    // Show sample employees
    console.log('\nÌ±• SAMPLE EMPLOYEES:');
    const samples = await Employee.find().sort({ riskScore: -1 }).limit(3);
    samples.forEach((emp, idx) => {
      console.log(`\n${idx + 1}. ${emp.name} (${emp.employeeId})`);
      console.log(`   Department: ${emp.department} - ${emp.role}`);
      console.log(`   Location: ${emp.location}`);
      console.log(`   Risk: ${emp.riskScore}% ‚Üí ${emp.riskLevel.toUpperCase()}`);
      console.log(`   Performance: ${emp.performanceRating}/5.0`);
      console.log(`   Tenure: ${emp.tenureMonths} months`);
      console.log(`   Engagement: ${(emp.engagementScore * 100).toFixed(0)}%`);
      console.log(`   Comp Ratio: ${emp.compRatio.toFixed(2)}`);
    });
    
    await mongoose.disconnect();
    console.log('\nÌ¥å MongoDB disconnected');
    console.log('\nÌæâ SEEDING COMPLETE!');
    console.log('\nÌ≥ù Next steps:');
    console.log('   1. Start your app: npm run dev');
    console.log('   2. Visit: http://localhost:3000/test-risk');
    console.log('   3. Check your Employee Risk Registry');
    
    process.exit(0);
    
  } catch (error) {
    console.error('‚ùå Error seeding employees:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the seed
seed();
