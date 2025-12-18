const { MongoClient } = require('mongodb');

// CONFIGURATION
const CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://jlpanetta1681:Wookie2011@prometheus.inv2hx4.mongodb.net/talent-risk?retryWrites=true&w=majority',
  DB_NAME: 'talent-risk',
  TOTAL_EMPLOYEES: 50
};

// GENERATE EMPLOYEE
function generateEmployee(id) {
  const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'HR'];
  const department = departments[Math.floor(Math.random() * departments.length)];
  
  // Generate realistic risk scores
  let riskScore = Math.floor(Math.random() * 100);
  
  // Bias: 20% high risk, 30% medium, 50% low
  const rand = Math.random();
  if (rand < 0.2) riskScore = 60 + Math.floor(Math.random() * 40); // High: 60-100
  else if (rand < 0.5) riskScore = 40 + Math.floor(Math.random() * 20); // Medium: 40-59
  else riskScore = Math.floor(Math.random() * 40); // Low: 0-39
  
  const riskLevel = riskScore >= 60 ? 'HIGH' : riskScore >= 40 ? 'MEDIUM' : 'LOW';
  
  return {
    employeeId: `UI_${String(id + 1).padStart(3, '0')}`,
    name: `Employee ${id + 1}`,
    department: department,
    riskScore: riskScore,
    riskLevel: riskLevel,
    performanceRating: parseFloat((2.5 + Math.random() * 2.5).toFixed(1)),
    engagementScore: 50 + Math.floor(Math.random() * 50),
    tenureMonths: 6 + Math.floor(Math.random() * 54),
    createdAt: new Date()
  };
}

// MAIN FUNCTION
async function seedDatabase() {
  let client;
  try {
    console.log('Connecting to MongoDB...');
    client = await MongoClient.connect(CONFIG.MONGODB_URI);
    const db = client.db(CONFIG.DB_NAME);
    
    console.log('Clearing existing data...');
    await db.collection('employees').deleteMany({});
    
    console.log(`Generating ${CONFIG.TOTAL_EMPLOYEES} employees...`);
    const employees = [];
    for (let i = 0; i < CONFIG.TOTAL_EMPLOYEES; i++) {
      employees.push(generateEmployee(i));
    }
    
    const result = await db.collection('employees').insertMany(employees);
    console.log(`Inserted ${result.insertedCount} employees`);
    
    // Statistics
    const highRisk = employees.filter(e => e.riskScore >= 60).length;
    const medRisk = employees.filter(e => e.riskScore >= 40 && e.riskScore < 60).length;
    const lowRisk = employees.filter(e => e.riskScore < 40).length;
    
    console.log('\n=== STATISTICS ===');
    console.log(`High risk (≥60): ${highRisk} employees`);
    console.log(`Medium risk (40-59): ${medRisk} employees`);
    console.log(`Low risk (<40): ${lowRisk} employees`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (client) await client.close();
    console.log('Done.');
  }
}

seedDatabase();
