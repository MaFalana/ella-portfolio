import { NextApiRequest, NextApiResponse } from 'next';
import { removeTokenCookie } from '@/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Remove the auth cookie
    removeTokenCookie(res);

    return res.status(200).json({ message: 'Logged out successfully' });
}