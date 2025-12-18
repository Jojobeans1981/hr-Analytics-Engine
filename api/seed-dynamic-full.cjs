const { MongoClient } = require('mongodb');

// ======================
// DYNAMIC CONFIGURATION (can be changed via command line)
// ======================
const CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://beamers051681:allthewayhome@prometheus.inv2hx4.mongodb.net/talent-risk?retryWrites=true&w=majority',
  DB_NAME: 'talent-risk',
  TOTAL_EMPLOYEES: process.argv[2] ? parseInt(process.argv[2]) : 20, // Command line arg 1: count
  HIGH_RISK_PERCENT: process.argv[3] ? parseFloat(process.argv[3]) : 30, // Command line arg 2: high risk %
  MEDIUM_RISK_PERCENT: process.argv[4] ? parseFloat(process.argv[4]) : 40, // Command line arg 3: medium risk %
  CLEAR_EXISTING: process.argv.includes('--clear'), // --clear flag to delete all first
  DEPARTMENTS: ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Legal', 'Operations'],
  LOCATIONS: ['San Francisco', 'New York', 'Remote', 'Austin', 'Seattle', 'London', 'Berlin', 'Tokyo']
};

// ======================
// GENERATE DYNAMIC EMPLOYEE
// ======================
function generateEmployee(id, existingCount) {
  const firstNames = ['Alex','Jordan','Taylor','Casey','Riley','Morgan','Avery','Quinn','Blake','Hayden','Peyton','Dakota','Emerson','Finley','Rowan','Sawyer','Kai','River','Phoenix','Skyler'];
  const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Davis','Rodriguez','Lee','Wilson','Martinez','Anderson','Thomas','Jackson','White','Harris','Clark','Lewis','Young','King'];
  
  const firstName = firstNames[(id + existingCount) % firstNames.length];
  const lastName = lastNames[(id + existingCount * 2) % lastNames.length];
  const department = CONFIG.DEPARTMENTS[(id + existingCount * 3) % CONFIG.DEPARTMENTS.length];
  
  // Dynamic risk distribution based on config
  const riskRandom = Math.random() * 100;
  let riskScore;
  
  if (riskRandom < CONFIG.HIGH_RISK_PERCENT) {
    // High risk: 70-100
    riskScore = 70 + Math.floor(Math.random() * 31);
  } else if (riskRandom < CONFIG.HIGH_RISK_PERCENT + CONFIG.MEDIUM_RISK_PERCENT) {
    // Medium risk: 40-69
    riskScore = 40 + Math.floor(Math.random() * 30);
  } else {
    // Low risk: 0-39
    riskScore = Math.floor(Math.random() * 40);
  }
  
  const riskLevel = riskScore >= 70 ? 'HIGH' : riskScore >= 40 ? 'MEDIUM' : 'LOW';
  
  // Dynamic tenure: 1-72 months
  const tenure = 1 + Math.floor(Math.random() * 72);
  
  // Performance inversely related to risk
  const performance = riskScore > 70 ? (1.5 + Math.random() * 1.5) : 
                     riskScore > 40 ? (2.5 + Math.random() * 1.5) : 
                     (3.5 + Math.random() * 1.5);
  
  // Engagement inversely related to risk
  const engagement = riskScore > 70 ? (30 + Math.floor(Math.random() * 40)) :
                    riskScore > 40 ? (50 + Math.floor(Math.random() * 40)) :
                    (70 + Math.floor(Math.random() * 30));

  return {
    employeeId: `EMP${String(existingCount + id + 1).padStart(4, '0')}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${existingCount + id}@techcorp.com`,
    department: department,
    tenureMonths: tenure,
    performanceRating: parseFloat(performance.toFixed(1)),
    engagementScore: engagement,
    riskScore: riskScore,
    riskLevel: riskLevel,
    location: CONFIG.LOCATIONS[(id + existingCount * 5) % CONFIG.LOCATIONS.length],
    hireDate: new Date(Date.now() - tenure * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    criticalSkills: ['JavaScript','Python','React','Node.js','AWS','SQL','Communication','Leadership','Agile','DevOps'].slice(0, 2 + (id % 5)),
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// ======================
// MAIN SEED FUNCTION
// ======================
async function seedDatabase() {
  let client;
  try {
    console.log('Ì¥å Connecting to MongoDB...');
    client = await MongoClient.connect(CONFIG.MONGODB_URI);
    const db = client.db(CONFIG.DB_NAME);
    
    // Get current count
    const existingCount = await db.collection('employees').countDocuments();
    console.log(`Ì≥ä Existing employees in database: ${existingCount}`);
    
    if (CONFIG.CLEAR_EXISTING) {
      console.log('Ì∑ëÔ∏è  CLEARING all existing employees (--clear flag used)...');
      await db.collection('employees').deleteMany({});
      console.log('‚úÖ Database cleared');
    }
    
    console.log(`\nÌº± GENERATING ${CONFIG.TOTAL_EMPLOYEES} new employees...`);
    console.log(`   High risk: ${CONFIG.HIGH_RISK_PERCENT}%`);
    console.log(`   Medium risk: ${CONFIG.MEDIUM_RISK_PERCENT}%`);
    console.log(`   Low risk: ${100 - CONFIG.HIGH_RISK_PERCENT - CONFIG.MEDIUM_RISK_PERCENT}%`);
    
    const employees = [];
    for (let i = 0; i < CONFIG.TOTAL_EMPLOYEES; i++) {
      employees.push(generateEmployee(i, existingCount));
    }
    
    console.log('Ì≥• Inserting into database...');
    const result = await db.collection('employees').insertMany(employees);
    
    const highRisk = employees.filter(e => e.riskLevel === 'HIGH').length;
    const medRisk = employees.filter(e => e.riskLevel === 'MEDIUM').length;
    const lowRisk = employees.filter(e => e.riskLevel === 'LOW').length;
    
    console.log(`\n‚úÖ SUCCESS! Added ${result.insertedCount} new employees`);
    console.log(`Ì≥à New total in database: ${existingCount + result.insertedCount}`);
    console.log('\nÌ≥ä NEW EMPLOYEES RISK DISTRIBUTION:');
    console.log(`   Ì¥¥ High risk: ${highRisk} (${((highRisk/CONFIG.TOTAL_EMPLOYEES)*100).toFixed(1)}%)`);
    console.log(`   Ìø° Medium risk: ${medRisk} (${((medRisk/CONFIG.TOTAL_EMPLOYEES)*100).toFixed(1)}%)`);
    console.log(`   Ìø¢ Low risk: ${lowRisk} (${((lowRisk/CONFIG.TOTAL_EMPLOYEES)*100).toFixed(1)}%)`);
    
    console.log('\nÌ±• SAMPLE OF NEW EMPLOYEES:');
    employees.slice(0, 3).forEach(emp => {
      console.log(`   ‚Ä¢ ${emp.employeeId}: ${emp.name} - ${emp.department}`);
      console.log(`     Risk: ${emp.riskScore} (${emp.riskLevel}) | Tenure: ${emp.tenureMonths}mo | Perf: ${emp.performanceRating}`);
    });
    
  } catch (error) {
    console.error('‚ùå Error:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('\nÌ¥å Connection closed.');
    }
  }
}

// ======================
// USAGE INSTRUCTIONS
// ======================
console.log(`
ÌæØ DYNAMIC DATABASE SEED SCRIPT
================================
Usage:
  node seed-dynamic-full.cjs [count] [high%] [medium%] [--clear]

Examples:
  node seed-dynamic-full.cjs                    # Add 20 employees (default)
  node seed-dynamic-full.cjs 50                 # Add 50 employees
  node seed-dynamic-full.cjs 30 40 40           # Add 30: 40% high, 40% medium, 20% low
  node seed-dynamic-full.cjs 100 50 30 --clear  # Clear DB, add 100: 50% high, 30% medium

Current configuration:
  Adding: ${CONFIG.TOTAL_EMPLOYEES} employees
  Risk: ${CONFIG.HIGH_RISK_PERCENT}% high, ${CONFIG.MEDIUM_RISK_PERCENT}% medium
  Clear existing: ${CONFIG.CLEAR_EXISTING ? 'YES (--clear flag)' : 'NO (adding to existing)'}
================================
`);

seedDatabase();
