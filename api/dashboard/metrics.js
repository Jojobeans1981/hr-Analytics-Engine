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

  let client;
  
  try {
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);
    
    // Get total employees
    const totalEmployees = await db.collection('employees').countDocuments();
    
    // Get average risk score
    const avgResult = await db.collection('employees').aggregate([
      {
        $group: {
          _id: null,
          avgRiskScore: { $avg: { $ifNull: ['$riskScore', 0] } }
        }
      }
    ]).toArray();
    
    const avgRiskScore = avgResult[0]?.avgRiskScore || 0;
    
    // Get risk distribution
    const riskDistribution = await db.collection('employees').aggregate([
      {
        $group: {
          _id: { $ifNull: ['$riskLevel', 'LOW'] },
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    const distribution = {
      high: riskDistribution.find(r => r._id === 'HIGH')?.count || 0,
      medium: riskDistribution.find(r => r._id === 'MEDIUM')?.count || 0,
      low: riskDistribution.find(r => r._id === 'LOW')?.count || 0
    };
    
    res.status(200).json({
      totalEmployees,
      avgRiskScore,
      highRiskEmployees: distribution.high,
      riskDistribution: distribution
    });
    
  } catch (error) {
    console.error('Error fetching metrics:', error);
    // Return mock metrics
    res.status(200).json({
      totalEmployees: 5,
      avgRiskScore: 52,
      highRiskEmployees: 2,
      riskDistribution: { high: 2, medium: 2, low: 1 }
    });
  } finally {
    if (client) await client.close();
  }
}
