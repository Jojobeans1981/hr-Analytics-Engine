const { MongoClient } = require('mongodb');

// DYNAMIC SEED CONFIG
const CONFIG = {
  MONGODB_URI: 'mongodb+srv://beamers051681:allthewayhome@prometheus.inv2hx4.mongodb.net/talent-risk?retryWrites=true&w=majority',
  DB_NAME: 'talent-risk',
  TOTAL_EMPLOYEES: process.argv[2] ? parseInt(process.argv[2]) : 20,
  HIGH_RISK_PERCENT: process.argv[3] ? parseFloat(process.argv[3]) : 30,
  MEDIUM_RISK_PERCENT: process.argv[4] ? parseFloat(process.argv[4]) : 40,
  CLEAR_EXISTING: process.argv.includes('--clear')
};

// GENERATE EMPLOYEE
function generateEmployee(id, existingCount) {
  const firstNames = ['Alex','Jordan','Taylor','Casey','Riley','Morgan'];
  const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia'];
  
  const firstName = firstNames[(id + existingCount) % firstNames.length];
  const lastName = lastNames[(id + existingCount * 2) % lastNames.length];
  const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'HR'];
  const department = departments[(id + existingCount) % departments.length];
  
  // Risk distribution
  const riskRandom = Math.random() * 100;
  let riskScore;
  
  if (riskRandom < CONFIG.HIGH_RISK_PERCENT) {
    riskScore = 70 + Math.floor(Math.random() * 31);
  } else if (riskRandom < CONFIG.HIGH_RISK_PERCENT + CONFIG.MEDIUM_RISK_PERCENT) {
    riskScore = 40 + Math.floor(Math.random() * 30);
  } else {
    riskScore = Math.floor(Math.random() * 40);
  }
  
  const riskLevel = riskScore >= 70 ? 'HIGH' : riskScore >= 40 ? 'MEDIUM' : 'LOW';
  const tenure = 1 + Math.floor(Math.random() * 72);
  const performance = parseFloat((1.5 + Math.random() * 3.0).toFixed(1));
  const engagement = 30 + Math.floor(Math.random() * 70);

  return {
    employeeId: `EMP${String(existingCount + id + 1001).padStart(4, '0')}`,
    name: `${firstName} ${lastName}`,
    department: department,
    tenureMonths: tenure,
    performanceRating: performance,
    engagementScore: engagement,
    riskScore: riskScore,
    riskLevel: riskLevel,
    createdAt: new Date()
  };
}

// MAIN FUNCTION
async function seedDatabase() {
  let client;
  try {
    console.log('Connecting...');
    client = await MongoClient.connect(CONFIG.MONGODB_URI);
    const db = client.db(CONFIG.DB_NAME);
    
    const existingCount = await db.collection('employees').countDocuments();
    console.log(`Existing: ${existingCount} employees`);
    
    if (CONFIG.CLEAR_EXISTING) {
      console.log('Clearing database...');
      await db.collection('employees').deleteMany({});
    }
    
    console.log(`Adding ${CONFIG.TOTAL_EMPLOYEES} new employees...`);
    const employees = [];
    for (let i = 0; i < CONFIG.TOTAL_EMPLOYEES; i++) {
      employees.push(generateEmployee(i, existingCount));
    }
    
    const result = await db.collection('employees').insertMany(employees);
    console.log(`Added ${result.insertedCount} employees`);
    console.log(`New total: ${existingCount + result.insertedCount}`);
    
    // Stats
    const high = employees.filter(e => e.riskLevel === 'HIGH').length;
    const medium = employees.filter(e => e.riskLevel === 'MEDIUM').length;
    const low = employees.filter(e => e.riskLevel === 'LOW').length;
    
    console.log(`\nRisk: ${high} high, ${medium} medium, ${low} low`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (client) await client.close();
  }
}

// RUN
console.log(`Adding ${CONFIG.TOTAL_EMPLOYEES} employees`);
console.log(`Risk: ${CONFIG.HIGH_RISK_PERCENT}% high, ${CONFIG.MEDIUM_RISK_PERCENT}% medium`);
console.log(`Clear: ${CONFIG.CLEAR_EXISTING ? 'YES' : 'NO'}\n`);

seedDatabase();
