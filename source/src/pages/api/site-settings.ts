import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuth } from '@/utils/auth-middleware';

interface SiteSettings {
  testimonialsEnabled: boolean;
  description: string;
  calendlyUrl: string;
  googleAnalyticsId: string;
}

const defaultSettings: SiteSettings = {
  testimonialsEnabled: true,
  description: 'Welcome to my portfolio',
  calendlyUrl: '',
  googleAnalyticsId: ''
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // For now, return default settings
    // In a real implementation, you'd fetch from a database
    return res.status(200).json(defaultSettings);
  }

  if (req.method === 'PUT') {
    // Verify authentication
    const authResult = verifyAuth(req);
    if (!authResult.success) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const settings: SiteSettings = req.body;
      
      // Validate the settings
      if (typeof settings.testimonialsEnabled !== 'boolean' || 
          typeof settings.description !== 'string' ||
          typeof settings.calendlyUrl !== 'string' ||
          typeof settings.googleAnalyticsId !== 'string') {
        return res.status(400).json({ error: 'Invalid settings format' });
      }

      // In a real implementation, you'd save to a database
      // For now, just return success
      return res.status(200).json(settings);
    } catch (error) {
      console.error('Error updating site settings:', error);
      return res.status(500).json({ error: 'Failed to update settings' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}