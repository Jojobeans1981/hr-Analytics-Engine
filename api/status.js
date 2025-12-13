export default async function handler(req, res) {
  // Set headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Simple response
  return res.status(200).json({
    status: "API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    hasMongoDB: !!process.env.MONGODB_URI,
    endpoints: [
      "/api/status",
      "/api/employees", 
      "/api/dashboard/metrics",
      "/api/health"
    ]
  });
}
