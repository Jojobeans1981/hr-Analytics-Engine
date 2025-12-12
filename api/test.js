export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simple test response
  res.status(200).json({
    message: 'API is working',
    timestamp: new Date().toISOString(),
    data: [
      { id: 1, name: 'Test Employee 1', department: 'Engineering', riskScore: 75 },
      { id: 2, name: 'Test Employee 2', department: 'Sales', riskScore: 45 }
    ]
  });
}
