const mongoose = require('mongoose');
require('dotenv').config();

const Employee = require('./models/Employee');

async function testPrometheus() {
  console.log('Testing connection to Prometheus database...\n');
  
  try {
    // Connect to Prometheus database
    await mongoose.connect('mongodb://localhost:27017/Prometheus', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`‚úÖ Connected to: ${mongoose.connection.host}/${mongoose.connection.name}`);
    
    // Count documents
    const count = await Employee.countDocuments();
    console.log(`Ì≥ä Total employees: ${count}`);
    
    if (count > 0) {
      // Get sample data
      const employees = await Employee.find().limit(5);
      console.log('\nÌ±• Sample employees:');
      employees.forEach(emp => {
        console.log(`  - ${emp.name} (${emp.department}): ${emp.riskScore}% - ${emp.riskLevel}`);
      });
      
      // Get statistics
      const highRisk = await Employee.countDocuments({ riskLevel: 'high' });
      const mediumRisk = await Employee.countDocuments({ riskLevel: 'medium' });
      const lowRisk = await Employee.countDocuments({ riskLevel: 'low' });
      
      console.log('\nÌ≥à Risk Distribution:');
      console.log(`  High Risk: ${highRisk} (${Math.round((highRisk/count)*100)}%)`);
      console.log(`  Medium Risk: ${mediumRisk} (${Math.round((mediumRisk/count)*100)}%)`);
      console.log(`  Low Risk: ${lowRisk} (${Math.round((lowRisk/count)*100)}%)`);
    } else {
      console.log('\n‚ö†Ô∏è  No employees found in the database!');
    }
    
    await mongoose.connection.close();
    console.log('\n‚úÖ Test completed successfully!');
    
  } catch (error) {
    console.error('‚ùå Error:', error.message);
  }
}

testPrometheus();
