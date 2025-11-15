import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    console.log('Proxying request to /api/dashboard-metrics');
    
    const response = await fetch('https://prometheus-talent-engine-production.up.railway.app/api/dashboard-metrics', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers your backend expects
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', response.status, errorText);
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched dashboard metrics');
    
    // Set CORS headers for the proxy response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error for /api/dashboard-metrics:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch dashboard metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}