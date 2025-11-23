// mongoAnalyzer.ts
import { MongoClient } from 'mongodb';

async function analyzeMongoDataStructure() {
    let client;

    try {
        // Use your MongoDB connection string - remove the hardcoded password!
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
            console.log("❌ MONGODB_URI environment variable is not set");
            console.log("Please set it in your .env file or Railway variables");
            return;
        }

        console.log("🔗 Connecting to MongoDB...");
        client = new MongoClient(mongoUri);
        await client.connect();

        // Get the database - FIXED: don't use Prometheus.db()
        const db = client.db(); // This uses the database from your connection string
        console.log("✅ Connected to database");

        // List all collections to see what you have
        const collections = await db.listCollections().toArray();
        console.log("\n📁 Available collections:");
        collections.forEach(col => console.log(`   - ${col.name}`));

        // Check each collection
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            const collection = db.collection(collectionName);

            console.log(`\n🔍 Analyzing collection: ${collectionName}`);
            console.log(`   Total documents: ${await collection.countDocuments()}`);

            // Get sample documents
            const sampleDocs = await collection.find().limit(3).toArray();

            if (sampleDocs.length === 0) {
                console.log("   No documents found");
                continue;
            }

            const firstDoc = sampleDocs[0];
            console.log(`   Fields: ${Object.keys(firstDoc).join(', ')}`);

            // Show preview of data
            console.log(`   Sample data preview:`);
            Object.entries(firstDoc).slice(0, 5).forEach(([key, value]) => {
                if (key !== '_id') {
                    const preview = typeof value === 'object' ? 
                        JSON.stringify(value).substring(0, 50) : 
                        String(value).substring(0, 50);
                    console.log(`     ${key}: ${preview}`);
                }
            });
        }

    } catch (error) {
        console.error("❌ Error analyzing MongoDB:", error);
    } finally {
        if (client) {
            await client.close();
            console.log("🔌 Connection closed");
        }
    }
}

// Run if this file is executed directly
if (require.main === module) {
    analyzeMongoDataStructure();
}

export { analyzeMongoDataStructure };