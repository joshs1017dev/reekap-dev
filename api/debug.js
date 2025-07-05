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

  // Debug info
  const debugInfo = {
    env: {
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasPasscode: !!process.env.SINGLE_PASSCODE,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV
    },
    headers: {
      passcode: req.headers['x-passcode'] ? 'provided' : 'missing'
    },
    timestamp: new Date().toISOString()
  };

  res.status(200).json(debugInfo);
}