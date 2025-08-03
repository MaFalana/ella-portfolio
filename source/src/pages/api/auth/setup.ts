import { NextApiRequest, NextApiResponse } from 'next';
import PortfolioManager from '@/managers/PortfolioManager';
import User from '@/managers/UserModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await PortfolioManager.connect();

        // Check if any admin user exists
        const adminExists = await User.findOne({ role: 'admin' });

        if (adminExists) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Create the admin user
        const admin = new User({
            email,
            password,
            role: 'admin'
        });

        await admin.save();

        return res.status(201).json({ 
            message: 'Admin user created successfully',
            email: admin.email 
        });
    } catch (error) {
        console.error('Setup error:', error);
        return res.status(500).json({ error: 'Failed to create admin user' });
    }
}