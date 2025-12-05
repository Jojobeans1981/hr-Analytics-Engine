require('dotenv').config();
const mongoose = require('mongoose');

async function seedFixed() {
  console.log('í¼± SEEDING FIXED VERSION');
  console.log('=========================\n');
  
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('âœ… Connected to MongoDB');
  
  // Get Employee model
  const { Employee } = require('./src/models/employee.model');
  
  // Clear existing
  console.log('í·¹ Clearing existing employees...');
  await Employee.deleteMany({});
  
  const employees = [];
  const count = 50;
  
  console.log(`\ní¾² Generating ${count} employees...\n`);
  
  for (let i = 1; i <= count; i++) {
    // Determine risk level
    let riskLevel;
    let performanceRating, tenureMonths, engagementScore, compRatio;
    
    // Distribution: 15% high, 25% medium, 60% low
    const rand = i / count;
    
    if (rand <= 0.15) {
      riskLevel = 'high';
      performanceRating = 1.2 + Math.random() * 0.8; // 1.2-2.0
      tenureMonths = Math.floor(Math.random() * 6); // 0-5
      engagementScore = 0.1 + Math.random() * 0.3; // 0.1-0.4
      compRatio = 0.6 + Math.random() * 0.2; // 0.6-0.8
    } else if (rand <= 0.40) {
      riskLevel = 'medium';
      performanceRating = 2.5 + Math.random() * 1.0; // 2.5-3.5
      tenureMonths = 6 + Math.floor(Math.random() * 18); // 6-23
      engagementScore = 0.4 + Math.random() * 0.3; // 0.4-0.7
      compRatio = 0.8 + Math.random() * 0.2; // 0.8-1.0
    } else {
      riskLevel = 'low';
      performanceRating = 3.5 + Math.random() * 1.3; // 3.5-4.8
      tenureMonths = 24 + Math.floor(Math.random() * 48); // 24-71
      engagementScore = 0.7 + Math.random() * 0.2; // 0.7-0.9
      compRatio = 1.0 + Math.random() * 0.3; // 1.0-1.3
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
    
    // Departments and roles
    const departments = ['Engineering', 'Sales', 'HR', 'Finance', 'Marketing', 'Operations'];
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
    
    // Create employee
    employees.push({
      name: `Employee ${i}`,
      email: `employee${i}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}@company.com`,
      employeeId: `EMP-${1000 + i}`,
      department,
      role,
      location: ['New York', 'San Francisco', 'Remote', 'Chicago'][i % 4],
      tenureMonths,
      performanceRating: parseFloat(performanceRating.toFixed(2)),
      engagementScore: parseFloat(engagementScore.toFixed(2)),
      compRatio: parseFloat(compRatio.toFixed(2)),
      criticalSkills: ['Communication', 'Teamwork'],
      skillGaps: riskLevel === 'high' ? ['Communication', 'Teamwork'] : riskLevel === 'medium' ? ['Communication'] : [],
      riskScore,
      riskLevel,
      status: 'Active',
      lastAssessmentDate: new Date(),
      hireDate: new Date(Date.now() - tenureMonths * 30 * 24 * 60 * 60 * 1000)
    });
    
    // Progress
    if (i % 10 === 0) console.log(`   Created ${i}/${count}...`);
  }
  
  // Insert
  console.log('\ní²¾ Saving to database...');
  await Employee.insertMany(employees);
  console.log(`âœ… Inserted ${employees.length} employees`);
  
  // Show distribution
  const distribution = await Employee.aggregate([
    { $group: { _id: "$riskLevel", count: { $sum: 1 } } }
  ]);
  
  console.log('\ní³Š DISTRIBUTION:');
  distribution.forEach(d => {
    const pct = ((d.count / count) * 100).toFixed(1);
    console.log(`   ${d._id ? d._id.toUpperCase() : 'UNKNOWN'}: ${d.count} (${pct}%)`);
  });
  
  await mongoose.disconnect();
  console.log('\ní¾‰ Seeding complete!');
}

seedFixed().catch(console.error);
