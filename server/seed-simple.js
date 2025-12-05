require('dotenv').config();
const mongoose = require('mongoose');

async function seedSimple() {
  console.log('Ìº± SIMPLE SEED SCRIPT');
  console.log('=====================\n');
  
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('‚úÖ Connected to MongoDB');
  
  // Try to load the Employee model
  let Employee;
  try {
    const model = require('./src/models/employee.model');
    Employee = model.Employee || model.default || model;
    console.log('‚úÖ Loaded Employee model');
  } catch (err) {
    console.log('‚ö†Ô∏è  Could not load model, creating schema...');
    // Create a simple schema
    const employeeSchema = new mongoose.Schema({
      name: String,
      email: String,
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
      createdAt: Date,
      updatedAt: Date
    });
    
    Employee = mongoose.model('Employee', employeeSchema);
  }
  
  // Clear existing
  console.log('Ì∑π Clearing existing employees...');
  await Employee.deleteMany({});
  console.log('‚úÖ Collection cleared');
  
  const count = 60;
  const employees = [];
  
  console.log(`\nÌæ≤ Generating ${count} employees...\n`);
  
  for (let i = 1; i <= count; i++) {
    // Risk profile
    let riskLevel, performanceRating, tenureMonths, engagementScore, compRatio;
    const position = i / count;
    
    if (position <= 0.15) {
      riskLevel = 'high';
      performanceRating = 1.2 + Math.random() * 0.8;
      tenureMonths = Math.floor(Math.random() * 6);
      engagementScore = 0.1 + Math.random() * 0.3;
      compRatio = 0.6 + Math.random() * 0.2;
    } else if (position <= 0.40) {
      riskLevel = 'medium';
      performanceRating = 2.5 + Math.random() * 1.0;
      tenureMonths = 6 + Math.floor(Math.random() * 18);
      engagementScore = 0.4 + Math.random() * 0.3;
      compRatio = 0.8 + Math.random() * 0.2;
    } else {
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
    
    // Create employee
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    
    employees.push({
      name: `Employee ${i}`,
      email: `employee${i}-${timestamp}-${randomStr}@company.com`,
      employeeId: `EMP${1000 + i}`,
      department: ['Engineering', 'Sales', 'HR', 'Finance', 'Marketing'][i % 5],
      role: ['Junior', 'Mid', 'Senior', 'Lead'][i % 4],
      location: ['New York', 'San Francisco', 'Remote'][i % 3],
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
    
    if (i % 10 === 0) console.log(`   Created ${i}/${count}...`);
  }
  
  console.log('\nÌ≤æ Saving to database...');
  await Employee.insertMany(employees);
  console.log(`‚úÖ Inserted ${employees.length} employees`);
  
  // Show results
  const distribution = await Employee.aggregate([
    { $group: { _id: "$riskLevel", count: { $sum: 1 } } }
  ]);
  
  console.log('\nÌ≥ä DISTRIBUTION:');
  distribution.forEach(d => {
    const pct = ((d.count / count) * 100).toFixed(1);
    console.log(`   ${d._id.toUpperCase()}: ${d.count} (${pct}%)`);
  });
  
  await mongoose.disconnect();
  console.log('\nÌæâ Seeding complete!');
}

seedSimple().catch(console.error);
