import { NextApiRequest, NextApiResponse } from 'next';
import PortfolioManager from '@/managers/PortfolioManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log('Testing database connection...');
        console.log('Environment variables:', {
            MONGO_USER: process.env.MONGO_USER ? 'set' : 'not set',
            MONGO_PASS: process.env.MONGO_PASS ? 'set' : 'not set',
            MONGO_CLUSTER: process.env.MONGO_CLUSTER ? 'set' : 'not set',
            MONGO_DB: process.env.MONGO_DB ? 'set' : 'not set'
        });

        await PortfolioManager.connect();
        
        return res.status(200).json({ 
            message: 'Database connection successful',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Database connection error:', error);
        return res.status(500).json({ 
            error: 'Database connection failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}