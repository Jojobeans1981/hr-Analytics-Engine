const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('talent-risk-ai');
    
    console.log('Checking talent-risk-ai database...\n');
    
    const collections = await db.listCollections().toArray();
    
    for (const col of collections) {
      const collection = db.collection(col.name);
      const count = await collection.countDocuments();
      console.log(`${col.name}: ${count} documents`);
      
      if (count > 0) {
        const sample = await collection.findOne();
        console.log('  Sample fields:', Object.keys(sample));
        
        // If it looks like employee data
        if (sample.name && sample.department) {
          console.log('  Sample employee:', {
            name: sample.name,
            department: sample.department,
            riskScore: sample.riskScore
          });
        }
      }
      console.log('');
    }
  } finally {
    await client.close();
  }
}

check().catch(console.error);
