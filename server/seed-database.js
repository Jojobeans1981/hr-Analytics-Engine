require('dotenv').config();
const mongoose = require('mongoose');

async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check if Employee model exists, create if not
    let Employee;
    try {
      // Try to load existing model
      const modelModule = require('./src/models/employee.model');
      Employee = modelModule.Employee || modelModule.default || modelModule;
      console.log('Loaded existing Employee model');
    } catch (error) {
      console.log('Creating temporary Employee schema...');
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
    
    // Clear existing employees
    console.log('Clearing existing employees...');
    await Employee.deleteMany({});
    
    // Create employees
    const employees = [];
    const totalEmployees = 50;
    
    console.log('Creating ' + totalEmployees + ' employees...');
    
    const departments = ['Engineering', 'Sales', 'HR', 'Finance', 'Marketing', 'Operations'];
    const locations = ['New York', 'San Francisco', 'Remote', 'Chicago', 'London'];
    
    for (let i = 1; i <= totalEmployees; i++) {
      // Determine risk level
      let riskLevel;
      let performanceRating;
      let tenureMonths;
      let engagementScore;
      let compRatio;
      
      // Distribution: 15% high, 25% medium, 60% low
      const position = i / totalEmployees;
      
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
      riskScore = riskScore + ((5 - performanceRating) / 4) * 40;
      
      if (tenureMonths < 6) {
        riskScore = riskScore + 20;
      } else if (tenureMonths < 12) {
        riskScore = riskScore + 15;
      } else if (tenureMonths < 24) {
        riskScore = riskScore + 10;
      }
      
      riskScore = riskScore + (1 - engagementScore) * 20;
      
      if (compRatio < 0.7) {
        riskScore = riskScore + 10;
      } else if (compRatio < 0.8) {
        riskScore = riskScore + 8;
      } else if (compRatio < 0.9) {
        riskScore = riskScore + 5;
      }
      
      riskScore = Math.min(100, Math.max(0, Math.round(riskScore * 10) / 10));
      
      // Create employee
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const department = departments[i % departments.length];
      const location = locations[i % locations.length];
      
      employees.push({
        name: 'Employee ' + i,
        email: 'employee' + i + '-' + timestamp + '-' + randomString + '@company.com',
        employeeId: 'EMP' + (1000 + i),
        department: department,
        role: department === 'Engineering' ? 'Software Engineer' :
              department === 'Sales' ? 'Sales Representative' :
              department === 'HR' ? 'HR Specialist' :
              department === 'Finance' ? 'Financial Analyst' :
              department === 'Marketing' ? 'Marketing Coordinator' : 'Operations Specialist',
        location: location,
        tenureMonths: tenureMonths,
        performanceRating: parseFloat(performanceRating.toFixed(2)),
        engagementScore: parseFloat(engagementScore.toFixed(2)),
        compRatio: parseFloat(compRatio.toFixed(2)),
        criticalSkills: ['Communication', 'Teamwork', 'Problem Solving'],
        skillGaps: riskLevel === 'high' ? ['Communication', 'Teamwork'] : 
                   riskLevel === 'medium' ? ['Communication'] : [],
        riskScore: riskScore,
        riskLevel: riskLevel,
        status: 'Active',
        lastAssessmentDate: new Date(),
        hireDate: new Date(Date.now() - tenureMonths * 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Show progress
      if (i % 10 === 0) {
        console.log('Created ' + i + ' of ' + totalEmployees + ' employees...');
      }
    }
    
    // Insert into database
    console.log('Saving employees to database...');
    const result = await Employee.insertMany(employees);
    console.log('Successfully inserted ' + result.length + ' employees');
    
    // Show distribution
    const distribution = await Employee.aggregate([
      { $group: { _id: "$riskLevel", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n=== RISK DISTRIBUTION ===');
    distribution.forEach(function(item) {
      const percentage = ((item.count / totalEmployees) * 100).toFixed(1);
      console.log(item._id.toUpperCase() + ' RISK: ' + item.count + ' employees (' + percentage + '%)');
    });
    
    // Show sample employees
    console.log('\n=== SAMPLE EMPLOYEES ===');
    const sampleEmployees = await Employee.find().limit(3);
    sampleEmployees.forEach(function(emp, index) {
      console.log('\n' + (index + 1) + '. ' + emp.name + ' (' + emp.employeeId + ')');
      console.log('   Department: ' + emp.department);
      console.log('   Risk: ' + emp.riskScore + '% → ' + emp.riskLevel.toUpperCase());
      console.log('   Performance: ' + emp.performanceRating + '/5.0');
      console.log('   Tenure: ' + emp.tenureMonths + ' months');
    });
    
    await mongoose.disconnect();
    console.log('\n✅ DATABASE SEEDING COMPLETE!');
    console.log('\nNext steps:');
    console.log('1. Start your backend server: npm run dev');
    console.log('2. Go to frontend directory: cd ../dashboard-new');
    console.log('3. Start frontend: npm run dev');
    console.log('4. Visit: http://localhost:3000/registry-test');
    
  } catch (error) {
    console.error('❌ ERROR during seeding:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seedDatabase();
