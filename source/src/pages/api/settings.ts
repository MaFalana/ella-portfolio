import type { NextApiResponse } from 'next';
import { connectDB } from '@/managers/PortfolioManager';
import { authMiddleware, AuthenticatedRequest } from '@/middleware/authMiddleware';
import mongoose from 'mongoose';

// Settings Schema
const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Ella Beardsley Portfolio' },
  siteDescription: { type: String, default: 'Art Therapist & Creative Professional' },
  enableGallery: { type: Boolean, default: true },
  enableTestimonials: { type: Boolean, default: true },
  enableContact: { type: Boolean, default: true },
  enableBooking: { type: Boolean, default: true },
  enableResume: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  analyticsEnabled: { type: Boolean, default: true },
  socialMedia: {
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' }
  },
  integrations: {
    calendlyUrl: { type: String, default: 'https://calendly.com/ella-beardsley' }
  },
  theme: {
    primaryColor: { type: String, default: '#667eea' },
    secondaryColor: { type: String, default: '#764ba2' },
    fontFamily: { type: String, default: 'Hk Grotesk' }
  }
}, { 
  timestamps: true 
});

const SettingsModel = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'PUT':
      return handlePut(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// GET /api/settings - Get current settings
async function handleGet(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    // For simplicity, we'll store only one settings document
    let settings = await SettingsModel.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = new SettingsModel({});
      await settings.save();
    }

    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
}

// PUT /api/settings - Update settings
async function handlePut(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const settingsData = req.body;

    // Find existing settings or create new one
    let settings = await SettingsModel.findOne();
    
    if (settings) {
      // Update existing settings
      Object.assign(settings, settingsData);
      await settings.save();
    } else {
      // Create new settings
      settings = new SettingsModel(settingsData);
      await settings.save();
    }

    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ error: 'Failed to update settings' });
  }
}

export default authMiddleware(handler, { requireAdmin: true });