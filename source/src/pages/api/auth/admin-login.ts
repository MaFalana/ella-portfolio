import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const ADMIN_PASSWORD = 'Spyglass5236';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        // Check if password matches
        if (password !== ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { 
                role: 'admin',
                timestamp: Date.now()
            },
            process.env.JWT_SECRET || 'ella-portfolio-secret-key',
            { expiresIn: '24h' }
        );

        // Set cookie
        const cookie = serialize('admin-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/'
        });

        res.setHeader('Set-Cookie', cookie);

        return res.status(200).json({ 
            message: 'Login successful',
            success: true
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Login failed' });
    }
}