import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/managers/PortfolioManager';
import mongoose from 'mongoose';

// Use the same schema as the main settings API
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

// Public endpoint for fetching non-sensitive settings (no auth required)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    // Get settings or create default if none exist
    let settings = await SettingsModel.findOne();
    
    if (!settings) {
      settings = new SettingsModel({});
      await settings.save();
    }

    // Return only public settings (excluding sensitive admin settings)
    const publicSettings = {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      enableGallery: settings.enableGallery,
      enableTestimonials: settings.enableTestimonials,
      enableContact: settings.enableContact,
      enableBooking: settings.enableBooking,
      enableResume: settings.enableResume,
      socialMedia: settings.socialMedia,
      integrations: {
        calendlyUrl: settings.integrations?.calendlyUrl
      },
      theme: settings.theme
    };

    return res.status(200).json(publicSettings);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    
    // Return default settings as fallback
    return res.status(200).json({
      siteName: 'Ella Beardsley Portfolio',
      siteDescription: 'Art Therapist & Creative Professional',
      enableGallery: true,
      enableTestimonials: true,
      enableContact: true,
      enableBooking: true,
      enableResume: true,
      socialMedia: {
        linkedin: '',
        instagram: '',
        twitter: '',
        facebook: ''
      },
      integrations: {
        calendlyUrl: 'https://calendly.com/ella-beardsley'
      },
      theme: {
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        fontFamily: 'Hk Grotesk'
      }
    });
  }
}