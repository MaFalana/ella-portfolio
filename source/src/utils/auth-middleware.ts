import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends NextApiRequest {
    user?: { role: string };
}

export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
        try {
            const token = req.cookies['admin-token'];

            if (!token) {
                return res.status(401).json({ error: 'No authentication token provided' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ella-portfolio-secret-key') as any;

            if (decoded.role !== 'admin') {
                return res.status(403).json({ error: 'Access denied' });
            }

            req.user = decoded;
            return await handler(req, res);
        } catch (error) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    };
}