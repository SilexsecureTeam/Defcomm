import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid file URL' });
  }

  const fileUrl = decodeURIComponent(url); // Decode the URL properly
  console.log("file url",fileUrl)
  try {
    const response = await fetch(fileUrl);

    if (!response.ok || !response.body) {
      return res.status(response.status).json({ error: 'Failed to fetch document' });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/pdf');
    response.body.pipe(res);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
