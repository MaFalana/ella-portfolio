import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, ProfileModel } from '@/managers/PortfolioManager';
import jwt from 'jsonwebtoken';

interface ProfileData {
  name: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    description?: string;
  }>;
  testimonials?: Array<{
    id: string;
    name: string;
    text: string;
    role?: string;
    rating?: number;
  }>;
  skills: string[];
  services: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication
  try {
    const token = req.cookies['admin-token'];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ella-portfolio-secret-key') as any;
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

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

// GET /api/profile - Get current profile data
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    // For simplicity, we'll store only one profile document
    let profile = await ProfileModel.findOne();
    
    const defaultTestimonials = [
      {
        id: '1',
        name: 'Sarah M.',
        text: 'Ella\'s art therapy sessions helped me process emotions I couldn\'t put into words. Her gentle guidance and creative approach made all the difference in my healing journey.',
        role: 'Individual Client',
        rating: 5
      },
      {
        id: '2', 
        name: 'Michael R.',
        text: 'The group art therapy sessions were transformative. Ella creates such a safe, non-judgmental space where creativity flows naturally.',
        role: 'Group Participant',
        rating: 5
      },
      {
        id: '3',
        name: 'Lisa K.',
        text: 'As someone who struggled with traditional talk therapy, Ella\'s art-based approach was exactly what I needed. Highly recommend!',
        role: 'Individual Client', 
        rating: 5
      }
    ];
    
    if (!profile) {
      // Create default profile if none exists
      profile = new ProfileModel({
        name: 'Ella Beardsley',
        title: 'Art Therapist',
        description: 'Passionate about helping others through creative expression and therapeutic art practices.',
        email: 'beardsleyella@gmail.com',
        phone: '',
        location: 'Indianapolis, IN',
        experience: [],
        education: [],
        skills: [],
        services: []
      });
      await profile.save();
    }

    // Add testimonials to the response (not stored in DB for now)
    const profileData = {
      ...profile.toObject(),
      testimonials: defaultTestimonials
    };

    return res.status(200).json(profileData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

// PUT /api/profile - Update profile data
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const profileData: ProfileData = req.body;

    // Validate required fields
    if (!profileData.name || !profileData.title) {
      return res.status(400).json({ 
        error: 'Name and title are required' 
      });
    }

    // Find existing profile or create new one
    let profile = await ProfileModel.findOne();
    
    if (profile) {
      // Update existing profile
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      // Create new profile
      profile = new ProfileModel(profileData);
      await profile.save();
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}

