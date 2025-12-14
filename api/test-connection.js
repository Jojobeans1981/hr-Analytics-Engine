
const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://jlpanetta1681:Wookie2011@prometheus.inv2hx4.mongodb.net/talent-risk?retryWrites=true&w=majority';

async function test() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('talent-risk');
  const count = await db.collection('employees').countDocuments();
  console.log('Employees in Atlas talent-risk:', count);
  await client.close();
}

test().catch(console.error);

