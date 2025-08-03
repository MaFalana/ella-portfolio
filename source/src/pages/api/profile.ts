import type { NextApiResponse } from 'next';
import { connectDB, ProfileModel } from '@/managers/PortfolioManager';
import { authMiddleware, AuthenticatedRequest } from '@/middleware/authMiddleware';

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
    period: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
    description: string;
  }>;
  skills: string[];
  services: string[];
}

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

// GET /api/profile - Get current profile data
async function handleGet(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    // For simplicity, we'll store only one profile document
    let profile = await ProfileModel.findOne();
    
    if (!profile) {
      // Create default profile if none exists
      profile = new ProfileModel({
        name: 'Ella Beardsley',
        title: 'Art Therapist',
        description: 'Passionate about helping others through creative expression and therapeutic art practices.',
        email: 'ella@example.com',
        phone: '',
        location: '',
        experience: [],
        education: [],
        skills: [],
        services: []
      });
      await profile.save();
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

// PUT /api/profile - Update profile data
async function handlePut(req: AuthenticatedRequest, res: NextApiResponse) {
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

export default authMiddleware(handler, { requireAdmin: true });