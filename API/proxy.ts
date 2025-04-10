import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid file URL' });
  }

  const fileUrl = `${import.meta.env.VITE_BASE_URL}secure/${url}`;

  try {
    const response = await fetch(fileUrl);

    if (!response.ok || !response.body) {
      return res.status(response.status).json({ error: 'Failed to fetch document' });
    }

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/pdf');

    response.body.pipe(res);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
