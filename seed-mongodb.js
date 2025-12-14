const { MongoClient } = require('mongodb');

// Replace <YOUR_PASSWORD> with your actual MongoDB password
const MONGODB_URI = 'mongodb+srv://jlpanetta1681:Wookie2011@prometheus.inv2hx4.mongodb.net/talent-risk?retryWrites=true&w=majority';
const MONGODB_DB = 'talent-risk';

const sampleEmployees = [
  {
    employeeId: 'EMP001',
    name: 'Johnathan Davis',
    email: 'john.davis@techcorp.com',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    tenure: 42, // months
    performanceScore: 4.7,
    engagementScore: 92,
    assessmentScore: 88,
    riskScore: 68,
    riskLevel: 'HIGH',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
    riskFactors: [
      'High market demand for skills',
      'Limited upward mobility',
      'Last promotion: 24+ months ago'
    ],
    hireDate: '2021-03-15',
    lastPromotion: '2023-01-10',
    salaryBand: 'L5',
    location: 'San Francisco'
  },
  {
    employeeId: 'EMP002',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    role: 'Product Manager',
    department: 'Product',
    tenure: 28,
    performanceScore: 4.2,
    engagementScore: 85,
    assessmentScore: 76,
    riskScore: 42,
    riskLevel: 'MEDIUM',
    skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis'],
    riskFactors: [
      'Recent role change',
      'High workload stress indicators'
    ],
    hireDate: '2022-08-10',
    lastPromotion: '2024-01-15',
    salaryBand: 'L4',
    location: 'New York'
  },
  {
    employeeId: 'EMP003',
    name: 'Michael Rodriguez',
    email: 'michael.r@techcorp.com',
    role: 'DevOps Engineer',
    department: 'Platform',
    tenure: 18,
    performanceScore: 3.8,
    engagementScore: 78,
    assessmentScore: 82,
    riskScore: 35,
    riskLevel: 'MEDIUM',
    skills: ['Kubernetes', 'Terraform', 'Python', 'CI/CD'],
    riskFactors: [
      'Short tenure (<2 years)',
      'Rapid promotion trajectory'
    ],
    hireDate: '2023-06-22',
    lastPromotion: '2024-06-22',
    salaryBand: 'L3',
    location: 'Remote'
  },
  {
    employeeId: 'EMP004',
    name: 'Jessica Williams',
    email: 'jessica.w@techcorp.com',
    role: 'UX Designer',
    department: 'Design',
    tenure: 60,
    performanceScore: 4.9,
    engagementScore: 94,
    assessmentScore: 91,
    riskScore: 18,
    riskLevel: 'LOW',
    skills: ['Figma', 'User Testing', 'Prototyping', 'Design Systems'],
    riskFactors: [
      'High performer - retention concern'
    ],
    hireDate: '2019-11-05',
    lastPromotion: '2024-03-20',
    salaryBand: 'L5',
    location: 'Austin'
  },
  {
    employeeId: 'EMP005',
    name: 'David Kim',
    email: 'david.kim@techcorp.com',
    role: 'Data Scientist',
    department: 'Analytics',
    tenure: 9,
    performanceScore: 3.2,
    engagementScore: 65,
    assessmentScore: 70,
    riskScore: 72,
    riskLevel: 'HIGH',
    skills: ['Python', 'SQL', 'Machine Learning', 'Statistics'],
    riskFactors: [
      'Low performance score',
      'Short tenure',
      'Low engagement metrics'
    ],
    hireDate: '2024-03-15',
    lastPromotion: null,
    salaryBand: 'L2',
    location: 'Seattle'
  }
];

async function seedDatabase() {
  let client;
  
  try {
    console.log('��� Connecting to MongoDB...');
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);
    
    // Check if employees collection exists
    const collections = await db.listCollections({ name: 'employees' }).toArray();
    
    if (collections.length > 0) {
      console.log('���️  Clearing existing employees...');
      await db.collection('employees').deleteMany({});
    }
    
    console.log('��� Seeding database with sample employees...');
    const result = await db.collection('employees').insertMany(sampleEmployees);
    
    console.log(`✅ Successfully seeded ${result.insertedCount} employees!`);
    console.log('��� Sample data includes:');
    sampleEmployees.forEach(emp => {
      console.log(`   - ${emp.name} (${emp.department}): ${emp.riskScore}% risk - ${emp.riskLevel}`);
    });
    
    // Create indexes for better query performance
    await db.collection('employees').createIndex({ employeeId: 1 }, { unique: true });
    await db.collection('employees').createIndex({ department: 1 });
    await db.collection('employees').createIndex({ riskLevel: 1 });
    await db.collection('employees').createIndex({ riskScore: -1 });
    
    console.log('��� Created database indexes for optimal performance.');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (error.code === 'ENOTFOUND') {
      console.error('   Check your MongoDB connection string and network access.');
    }
  } finally {
    if (client) {
      await client.close();
      console.log('��� MongoDB connection closed.');
    }
    console.log('\n��� Next steps:');
    console.log('1. Update your Vercel environment variables with MONGODB_URI');
    console.log('2. Redeploy: vercel --prod');
    console.log('3. Visit your dashboard to see real data!');
  }
}

// Run the seed function
seedDatabase();
