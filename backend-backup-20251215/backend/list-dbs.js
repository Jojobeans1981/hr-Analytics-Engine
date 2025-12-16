const { MongoClient } = require('mongodb');

async function listDatabases() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const adminDb = client.db('admin');
    const databases = await adminDb.admin().listDatabases();
    
    console.log('All databases on MongoDB:');
    console.log('========================\n');
    
    for (const dbInfo of databases.databases) {
      console.log(`Database: ${dbInfo.name}`);
      
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      
      for (const col of collections) {
        const collection = db.collection(col.name);
        const count = await collection.countDocuments();
        console.log(`  ${col.name}: ${count} docs`);
      }
      console.log('');
    }
  } finally {
    await client.close();
  }
}

listDatabases().catch(console.error);
