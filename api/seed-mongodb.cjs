const { MongoClient } = require('mongodb');

// ======================
// CONFIGURATION
// ======================
const CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://jlpanetta1681:Wookie2011@prometheus.inv2hx4.mongodb.net/talent-risk?retryWrites=true&w=majority',
  DB_NAME: 'talent-risk',
  TOTAL_EMPLOYEES: 50,
  CLEAR_EXISTING: true,
  DEPARTMENTS: ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR'],
  LOCATIONS: ['San Francisco', 'New York', 'Remote', 'Austin', 'Seattle']
};

// ======================
// GENERATE EMPLOYEE
// ======================
function generateEmployee(id) {
  const firstNames = ['John','Sarah','Mike','Jessica','David','Alex','Maria','James','Lisa','Robert'];
  const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Davis','Rodriguez','Lee','Wilson'];
  const roles = {
    Engineering: ['Dev','Senior Dev','Lead','Architect','Manager'],
    Product: ['PM','Senior PM','Director','Analyst'],
    Design: ['UX','UI','Product Designer','Research'],
    Marketing: ['Specialist','Manager','Analyst','Director'],
    Sales: ['Rep','Manager','Director','VP'],
    HR: ['Generalist','Manager','Recruiter','Director']
  };

  const firstName = firstNames[id % firstNames.length];
  const lastName = lastNames[id % lastNames.length];
  const department = CONFIG.DEPARTMENTS[Math.floor(Math.random() * CONFIG.DEPARTMENTS.length)];
  const roleList = roles[department];
  const role = roleList[Math.floor(Math.random() * roleList.length)];
  
  const tenure = Math.floor(Math.random() * 60) + 6;
  const performance = (Math.random() * 3) + 2;
  const engagement = Math.floor(Math.random() * 40) + 60;
  
  let riskScore = 0;
  riskScore += (tenure < 12) ? 25 : 0;
  riskScore += (performance < 3.0) ? 30 : 0;
  riskScore += (engagement < 70) ? 20 : 0;
  riskScore += Math.random() * 25;
  riskScore = Math.min(100, Math.max(0, riskScore));
  
  const riskLevel = riskScore > 70 ? 'HIGH' : riskScore > 40 ? 'MEDIUM' : 'LOW';

  return {
    employeeId: `EMP${String(id + 1).padStart(3, '0')}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@techcorp.com`,
    department: department,
    role: `${department} ${role}`,
    tenureMonths: tenure,
    performanceRating: parseFloat(performance.toFixed(1)),
    engagementScore: engagement,
    riskScore: Math.round(riskScore),
    riskLevel: riskLevel,
    location: CONFIG.LOCATIONS[Math.floor(Math.random() * CONFIG.LOCATIONS.length)],
    hireDate: new Date(Date.now() - tenure * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    criticalSkills: ['JavaScript','Python','React','Node.js','AWS','SQL','Communication','Leadership'].slice(0, 3 + (id % 3)),
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
    console.log('🔌 Connecting to MongoDB...');
    client = await MongoClient.connect(CONFIG.MONGODB_URI);
    const db = client.db(CONFIG.DB_NAME);
    
    if (CONFIG.CLEAR_EXISTING) {
      console.log('🗑️  Clearing existing employees...');
      await db.collection('employees').deleteMany({});
    }
    
    console.log(`🌱 Generating ${CONFIG.TOTAL_EMPLOYEES} employees...`);
    const employees = [];
    for (let i = 0; i < CONFIG.TOTAL_EMPLOYEES; i++) {
      employees.push(generateEmployee(i));
    }
    
    console.log('📥 Inserting into database...');
    const result = await db.collection('employees').insertMany(employees);
    
    console.log(`✅ Successfully seeded ${result.insertedCount} employees!`);
    console.log('\n👥 Sample:');
    employees.slice(0, 3).forEach(emp => {
      console.log(`   • ${emp.name} - ${emp.department} - ${emp.riskScore}% (${emp.riskLevel})`);
    });
    
    await db.collection('employees').createIndexes([
      { key: { employeeId: 1 }, unique: true },
      { key: { department: 1 } },
      { key: { riskLevel: 1 } },
      { key: { riskScore: -1 } }
    ]);
    
    console.log('📊 Indexes created.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Connection closed.');
    }
  }
}

// ======================
// RUN WITH ARGS
// ======================
const args = process.argv.slice(2);
if (args.includes('--count')) {
  const countIndex = args.indexOf('--count');
  if (args[countIndex + 1]) {
    CONFIG.TOTAL_EMPLOYEES = parseInt(args[countIndex + 1]);
    console.log(`📊 Setting count to: ${CONFIG.TOTAL_EMPLOYEES}`);
  }
}
if (args.includes('--keep')) CONFIG.CLEAR_EXISTING = false;

seedDatabase();