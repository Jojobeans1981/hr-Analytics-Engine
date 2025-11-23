// analyzeData.js
const { MongoClient } = require('mongodb');
require('dotenv').config(); // This loads your .env file

async function analyzeData() {
    console.log("🔍 Starting MongoDB analysis...");
    console.log("Using MONGODB_URI from .env file");
    
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.log("❌ MONGODB_URI not found in .env");
        return;
    }

    const client = new MongoClient(mongoUri);
    
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");
        
        const db = client.db();
        console.log("📊 Database:", db.databaseName);
        
        const collections = await db.listCollections().toArray();
        
        console.log(`\n📁 Found ${collections.length} collections:`);
        collections.forEach(col => console.log(`   - ${col.name}`));
        
        for (const col of collections) {
            const collection = db.collection(col.name);
            const count = await collection.countDocuments();
            console.log(`\n🎯 Collection: ${col.name}`);
            console.log(`   📄 Total documents: ${count}`);
            
            // Get a few samples
            const samples = await collection.find().limit(2).toArray();
            
            samples.forEach((sample, index) => {
                console.log(`\n   📋 Sample ${index + 1}:`);
                console.log(`      Fields: ${Object.keys(sample).join(', ')}`);
                
                // Show important fields
                const importantFields = ['name', 'email', 'role', 'department', 'skills', 'performance', 'tenure'];
                importantFields.forEach(field => {
                    if (sample[field] !== undefined) {
                        console.log(`      ${field}: ${JSON.stringify(sample[field])}`);
                    }
                });
                
                // Show a few other fields (non-_id)
                let shown = 0;
                for (const [key, value] of Object.entries(sample)) {
                    if (key !== '_id' && !importantFields.includes(key) && shown < 3) {
                        console.log(`      ${key}: ${typeof value === 'object' ? JSON.stringify(value).substring(0, 50) : value}`);
                        shown++;
                    }
                }
            });
        }
        
    } catch (error) {
        console.error("❌ Error:", error.message);
        console.log("💡 Check if your MongoDB URI is correct and accessible");
    } finally {
        await client.close();
        console.log("\n✅ Analysis complete!");
    }
}

analyzeData();