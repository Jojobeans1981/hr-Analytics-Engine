import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    console.log('Proxying request to /api/dashboard-metrics');

    const backendUrl =
      process.env.DASHBOARD_METRICS_API_URL || 'https://prometheus-talent-engine-production.up.railway.app/api/dashboard-metrics';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(backendUrl, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
    // Log full error server-side
    console.error('Proxy error for /api/dashboard-metrics:', error);

    // Detect timeout errors
    const isTimeout =
      error instanceof Error &&
      (error.name === 'TimeoutError' ||
        error.message.includes('AbortError') ||
        error.message.includes('timeout'));

    // Return appropriate status and message based on error type
    if (isTimeout) {
      return res.status(504).json({
        error: 'Request timeout while fetching dashboard metrics',
      });
    }

    // For non-development environments, return generic error without details
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorResponse: Record<string, string> = {
      error: 'Failed to fetch dashboard metrics',
    };

    if (isDevelopment && error instanceof Error) {
      errorResponse.details = error.message;
    }

    return res.status(500).json(errorResponse);
  }
}