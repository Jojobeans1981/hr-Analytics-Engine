const { MongoClient } = require('mongodb');

async function findAllEmployees() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const adminDb = client.db('admin');
    const databases = await adminDb.admin().listDatabases();
    
    console.log('Searching ALL databases for employee data...\n');
    
    for (const dbInfo of databases.databases) {
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      
      for (const col of collections) {
        const collection = db.collection(col.name);
        const count = await collection.countDocuments();
        
        // If collection has data
        if (count > 0) {
          const sample = await collection.findOne();
          const fields = Object.keys(sample);
          
          // Check if this looks like employee data
          const hasName = fields.some(f => f.toLowerCase().includes('name'));
          const hasDepartment = fields.some(f => f.toLowerCase().includes('department'));
          const hasEmail = fields.some(f => f.toLowerCase().includes('email'));
          
          if (hasName && (hasDepartment || hasEmail)) {
            console.log(`✅ FOUND in ${dbInfo.name}.${col.name}: ${count} documents`);
            console.log('   Sample:', {
              name: sample.name || sample.firstName || sample.employeeName,
              department: sample.department,
              riskScore: sample.riskScore || sample.risk
            });
            console.log('   Fields:', fields);
            console.log('');
          }
        }
      }
    }
  } finally {
    await client.close();
  }
}

findAllEmployees().catch(console.error);
