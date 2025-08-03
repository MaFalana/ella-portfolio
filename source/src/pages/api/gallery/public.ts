import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, GalleryModel } from '@/managers/PortfolioManager';
import data from '@/Ella.json';

// Public endpoint for fetching gallery items (no auth required)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    // Try to fetch from database first
    const items = await GalleryModel.find().sort({ createdAt: -1 });
    
    if (items && items.length > 0) {
      return res.status(200).json(items);
    } else {
      // Fallback to static data if no items in database
      return res.status(200).json(data.Art);
    }
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    // Return static data as fallback
    return res.status(200).json(data.Art);
  }
}