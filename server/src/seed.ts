import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://beamers051681:Wookie2011@Prometheus.inv2hx4.mongodb.net/Prometheus?retryWrites=true&w=majority';

const newEmployees = [
  {
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    department: "Engineering",
    role: "Senior Developer",
    riskScore: 0.25,
    riskLevel: "Low",
    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
    tenure: 3.5,
    performanceScore: 4.8,
    lastPromotion: "2023-06-15",
    engagementScore: 4.5
  },
  {
    name: "Marcus Rodriguez",
    email: "marcus.rodriguez@company.com",
    department: "Sales", 
    role: "Sales Manager",
    riskScore: 0.65,
    riskLevel: "Medium",
    skills: ["Negotiation", "CRM", "Client Relations"],
    tenure: 1.2,
    performanceScore: 3.2,
    lastPromotion: "2022-11-20",
    engagementScore: 3.0
  },
  // ... include all the other employees from previous example
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Check which employees already exist
    const existingEmails = await db.collection('employees')
      .find({}, { projection: { email: 1 } })
      .toArray()
      .then(employees => employees.map(emp => emp.email));
    
    // Only add employees that don't already exist
    const employeesToAdd = newEmployees.filter(emp => 
      !existingEmails.includes(emp.email)
    );

    if (employeesToAdd.length > 0) {
      await db.collection('employees').insertMany(employeesToAdd);
      console.log(`✅ Added ${employeesToAdd.length} new employees`);
      console.log('📧 New emails added:', employeesToAdd.map(emp => emp.email));
    } else {
      console.log('✅ All seed employees already exist in database');
    }

    // Get total count
    const totalEmployees = await db.collection('employees').countDocuments();
    console.log(`📊 Total employees in database: ${totalEmployees}`);

    console.log('🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();