import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const token = req.cookies['admin-token'];

        if (!token) {
            return res.status(401).json({ error: 'No authentication token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ella-portfolio-secret-key') as any;

        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Invalid permissions' });
        }

        return res.status(200).json({ 
            authenticated: true,
            role: decoded.role
        });

    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}