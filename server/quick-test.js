require('dotenv').config();
const { MongoClient } = require('mongodb');

async function quickTest() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  
  const db = client.db();
  const employees = db.collection('employees');
  
  const count = await employees.countDocuments();
  console.log(` Employees in database: ${count}`);
  
  if (count > 0) {
    const sample = await employees.findOne({});
    console.log('\n SAMPLE EMPLOYEE:');
    console.log(`   Name: ${sample.name}`);
    console.log(`   Email: ${sample.email}`);
    console.log(`   Risk: ${sample.riskScore}%  ${sample.riskLevel}`);
    console.log(`   Department: ${sample.department}`);
    
    // Distribution
    const pipeline = [
      { $group: { _id: "$riskLevel", count: { $sum: 1 } } }
    ];
    
    const dist = await employees.aggregate(pipeline).toArray();
    console.log('\n RISK DISTRIBUTION:');
    dist.forEach(d => {
      const pct = ((d.count / count) * 100).toFixed(1);
      console.log(`   ${d._id}: ${d.count} (${pct}%)`);
    });
  } else {
    console.log(' No employees found!');
  }
  
  await client.close();
}

quickTest().catch(console.error);
