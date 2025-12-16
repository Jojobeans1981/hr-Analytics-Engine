const mongoose = require('mongoose');

async function test() {
  console.log('Testing database connection...');
  
  await mongoose.connect('mongodb://localhost:27017/Prometheus', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  console.log('Connected to MongoDB');
  
  // Try to find ANY collection with data
  const collections = await mongoose.connection.db.listCollections().toArray();
  
  console.log('\nCollections found:');
  for (const col of collections) {
    const Model = mongoose.model(col.name, new mongoose.Schema({}, { strict: false }), col.name);
    const count = await Model.countDocuments();
    console.log(`- ${col.name}: ${count} documents`);
    
    if (count > 0) {
      const doc = await Model.findOne();
      console.log('  Sample fields:', Object.keys(doc.toObject()));
    }
  }
  
  await mongoose.connection.close();
}

test().catch(console.error);
