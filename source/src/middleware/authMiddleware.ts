import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken, getTokenFromCookies } from '@/utils/auth';

export interface AuthenticatedRequest extends NextApiRequest {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

export function withAuth(
    handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>,
    requireAdmin: boolean = false
) {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
        try {
            const token = getTokenFromCookies(req.headers.cookie);
            
            if (!token) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const payload = verifyToken(token);
            
            if (!payload) {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }

            if (requireAdmin && payload.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }

            req.user = payload;
            return handler(req, res);
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(500).json({ error: 'Authentication error' });
        }
    };
}

// More flexible middleware function
export function authMiddleware(
    handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>,
    options: { requireAdmin?: boolean } = {}
) {
    return withAuth(handler, options.requireAdmin || false);
}