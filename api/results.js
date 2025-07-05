import { getRecentResults, getResultById } from './lib/db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-passcode');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Verify passcode
    const passcode = req.headers['x-passcode'];
    if (!process.env.SINGLE_PASSCODE || passcode !== process.env.SINGLE_PASSCODE) {
      res.status(401).json({ error: 'Invalid passcode' });
      return;
    }

    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      res.status(400).json({ error: 'Database not configured' });
      return;
    }

    // Get ID from query params if provided
    const { id, limit = 10 } = req.query;

    let results;
    if (id) {
      // Get specific result by ID
      const result = await getResultById(id);
      if (!result) {
        res.status(404).json({ error: 'Result not found' });
        return;
      }
      results = result;
    } else {
      // Get recent results
      results = await getRecentResults(parseInt(limit));
    }

    res.status(200).json(results);

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve results',
      details: error.message 
    });
  }
}