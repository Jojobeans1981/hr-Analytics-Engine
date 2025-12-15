import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}
const MONGODB_DB = process.env.MONGODB_DB || 'talent-risk';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let client;
  
  try {
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);
    const employees = await db.collection('employees').find({}).toArray();
    
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error:', error);
    // Return mock data if database fails
    const mockEmployees = [
      {
        _id: '1',
        name: 'John Doe',
        department: 'Engineering',
        riskScore: 75,
        riskLevel: 'HIGH',
        performanceScore: 4.2,
        engagementScore: 78
      },
      {
        _id: '2',
        name: 'Jane Smith',
        department: 'Sales',
        riskScore: 45,
        riskLevel: 'MEDIUM',
        performanceScore: 2.8,
        engagementScore: 60
      }
    ];
    res.status(200).json(mockEmployees);
  } finally {
    if (client) await client.close();
  }
}
