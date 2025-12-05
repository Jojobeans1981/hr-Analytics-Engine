require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function findEmployeeModel() {
  console.log('Ì¥ç Searching for Employee model...');
  
  const searchPaths = [
    './src/models/employee.model.js',
    './src/models/employee.model.ts',
    './models/employee.model.js',
    './models/employee.model.ts',
    './server/src/models/employee.model.js',
    './server/models/employee.model.js'
  ];
  
  for (const modelPath of searchPaths) {
    if (fs.existsSync(modelPath)) {
      console.log(`‚úÖ Found model at: ${modelPath}`);
      
      // Try to require it
      try {
        const model = require(modelPath);
        return model.Employee || model.default || model;
      } catch (err) {
        console.log(`   ‚ö†Ô∏è  Could not require: ${err.message}`);
      }
    }
  }
  
  // If not found, create a simple schema
  console.log('‚ö†Ô∏è  Employee model not found. Creating temporary schema...');
  
  const employeeSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    employeeId: String,
    department: String,
    role: String,
    location: String,
    tenureMonths: Number,
    performanceRating: Number,
    engagementScore: Number,
    compRatio: Number,
    criticalSkills: [String],
    skillGaps: [String],
    riskScore: Number,
    riskLevel: String,
    status: String,
    lastAssessmentDate: Date,
    hireDate: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, { collection: 'employees' });
  
  return mongoose.model('Employee', employeeSchema);
}

async function seedUniversal(count = 50) {
  try {
    console.log('Ìº± UNIVERSAL SEED SCRIPT');
    console.log('========================\n');
    
    // Connect
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env file');
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('‚úÖ Connected to MongoDB');
    
    // Get or create Employee model
    const Employee = await findEmployeeModel();
    
    // Clear existing
    console.log('\nÌ∑π Clearing existing employees...');
    await Employee.deleteMany({});
    console.log('‚úÖ Collection cleared');
    
    console.log(`\nÌæ≤ Generating ${count} employees...\n`);
    
    const employees = [];
    const departments = ['Engineering', 'Sales', 'HR', 'Finance', 'Marketing', 'Operations'];
    const locations = ['New York', 'San Francisco', 'Remote', 'Chicago', 'London'];
    
    for (let i = 1; i <= count; i++) {
      // Determine risk level (15% high, 25% medium, 60% low)
      let riskLevel, performanceRating, tenureMonths, engagementScore, compRatio;
      const rand = i / count;
      
      if (rand <= 0.15) { // High risk
        riskLevel = 'high';
        performanceRating = 1.2 + Math.random() * 0.8;
        tenureMonths = Math.floor(Math.random() * 6);
        engagementScore = 0.1 + Math.random() * 0.3;
        compRatio = 0.6 + Math.random() * 0.2;
      } else if (rand <= 0.40) { // Medium risk
        riskLevel = 'medium';
        performanceRating = 2.5 + Math.random() * 1.0;
        tenureMonths = 6 + Math.floor(Math.random() * 18);
        engagementScore = 0.4 + Math.random() * 0.3;
        compRatio = 0.8 + Math.random() * 0.2;
      } else { // Low risk
        riskLevel = 'low';
        performanceRating = 3.5 + Math.random() * 1.3;
        tenureMonths = 24 + Math.floor(Math.random() * 48);
        engagementScore = 0.7 + Math.random() * 0.2;
        compRatio = 1.0 + Math.random() * 0.3;
      }
      
      // Calculate risk score
      let riskScore = 0;
      riskScore += ((5 - performanceRating) / 4) * 40;
      if (tenureMonths < 6) riskScore += 20;
      else if (tenureMonths < 12) riskScore += 15;
      else if (tenureMonths < 24) riskScore += 10;
      riskScore += (1 - engagementScore) * 20;
      if (compRatio < 0.7) riskScore += 10;
      else if (compRatio < 0.8) riskScore += 8;
      else if (compRatio < 0.9) riskScore += 5;
      riskScore = Math.min(100, Math.max(0, Math.round(riskScore * 10) / 10));
      
      // Department and role
      const department = departments[i % departments.length];
      const roles = {
        Engineering: ['Junior Engineer', 'Engineer', 'Senior Engineer'],
        Sales: ['SDR', 'Account Executive', 'Sales Manager'],
        HR: ['HR Coordinator', 'HR Generalist', 'HR Manager'],
        Finance: ['Financial Analyst', 'Senior Analyst', 'Finance Manager'],
        Marketing: ['Marketing Coordinator', 'Marketing Specialist', 'Marketing Manager'],
        Operations: ['Ops Analyst', 'Ops Specialist', 'Ops Manager']
      };
      
      const roleOptions = roles[department] || ['Employee'];
      const role = roleOptions[i % roleOptions.length];
      const location = locations[i % locations.length];
      
      // Create unique email
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const email = `employee${i}-${timestamp}-${randomStr}@company.com`;
      
      employees.push({
        name: `Employee ${i}`,
        email,
        employeeId: `EMP-${1000 + i}`,
        department,
        role,
        location,
        tenureMonths,
        performanceRating: parseFloat(performanceRating.toFixed(2)),
        engagementScore: parseFloat(engagementScore.toFixed(2)),
        compRatio: parseFloat(compRatio.toFixed(2)),
        criticalSkills: ['Communication', 'Teamwork'],
        skillGaps: riskLevel === 'high' ? ['Communication', 'Teamwork'] : 
                   riskLevel === 'medium' ? ['Communication'] : [],
        riskScore,
        riskLevel,
        status: 'Active',
        lastAssessmentDate: new Date(),
        hireDate: new Date(Date.now() - tenureMonths * 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Progress
      if (i % 10 === 0) console.log(`   Created ${i}/${count}...`);
    }
    
    // Insert
    console.log('\nÌ≤æ Saving to database...');
    await Employee.insertMany(employees);
    console.log(`‚úÖ Inserted ${employees.length} employees`);
    
    // Show distribution
    const distribution = await Employee.aggregate([
      { $group: { _id: "$riskLevel", count: { $sum: 1 } } }
    ]);
    
    console.log('\nÌ≥ä DISTRIBUTION:');
    let totalCounted = 0;
    distribution.forEach(d => {
      const pct = ((d.count / count) * 100).toFixed(1);
      console.log(`   ${d._id ? d._id.toUpperCase() : 'UNKNOWN'}: ${d.count} (${pct}%)`);
      totalCounted += d.count;
    });
    
    if (totalCounted < count) {
      console.log(`   UNCLASSIFIED: ${count - totalCounted} (${((count - totalCounted) / count * 100).toFixed(1)}%)`);
    }
    
    // Show sample
    console.log('\nÌ±• SAMPLE EMPLOYEES:');
    const samples = await Employee.find().limit(3);
    samples.forEach((emp, idx) => {
      console.log(`\n${idx + 1}. ${emp.name} (${emp.employeeId})`);
      console.log(`   ${emp.department} - ${emp.role}`);
      console.log(`   Risk: ${emp.riskScore}% ‚Üí ${emp.riskLevel.toUpperCase()}`);
      console.log(`   Perf: ${emp.performanceRating}/5.0, Tenure: ${emp.tenureMonths}mo`);
      console.log(`   Email: ${emp.email}`);
    });
    
    await mongoose.disconnect();
    console.log('\nÌæâ Seeding complete!');
    console.log('\nÌ≥ù Next steps:');
    console.log('   1. Run: node test-complete.js');
    console.log('   2. Start app: npm run dev');
    console.log('   3. Visit: http://localhost:3000/test-risk');
    
  } catch (error) {
    console.error('‚ùå Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Get count from command line
const args = process.argv.slice(2);
let count = 50;
if (args.length > 0 && !isNaN(parseInt(args[0]))) {
  count = parseInt(args[0]);
}

seedUniversal(count);
