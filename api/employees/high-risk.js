import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'talent-risk';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const threshold = parseInt(req.query.threshold) || 70;
  
  let client;
  
  try {
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);
    
    const highRiskEmployees = await db.collection('employees')
      .find({ riskScore: { $gte: threshold } })
      .toArray();
    
    res.status(200).json({
      data: highRiskEmployees,
      count: highRiskEmployees.length,
      threshold
    });
    
  } catch (error) {
    console.error('Error fetching high-risk employees:', error);
    // Return mock data
    const mockHighRisk = [
      {
        _id: '1',
        name: 'John Doe',
        department: 'Engineering',
        riskScore: 85,
        riskLevel: 'HIGH'
      },
      {
        _id: '4',
        name: 'Sarah Wilson',
        department: 'Marketing',
        riskScore: 78,
        riskLevel: 'HIGH'
      }
    ].filter(emp => emp.riskScore >= threshold);
    
    res.status(200).json({
      data: mockHighRisk,
      count: mockHighRisk.length,
      threshold
    });
  } finally {
    if (client) await client.close();
  }
}
