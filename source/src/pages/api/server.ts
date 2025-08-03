// src/pages/api/server.js
// This file handles the API endpoint for fetching gallery pieces
// It uses the PortfolioManager to retrieve the data and respond to GET requests

import { NextApiRequest, NextApiResponse } from "next";
import PortfolioManager from "../../managers/PortfolioManager";

export default async function handler(req: NextApiRequest, res: NextApiResponse) 
{
    if (req.method === "GET") 
        {
        try {
            const pieces = await PortfolioManager.getGalleryPieces();
            //const education = await PortfolioManager.getEducation();
            //const experience = await PortfolioManager.getExperience();
            res.status(200).json(pieces);
        } catch (error) {
            console.error("❌ API error:", error);
            res.status(500).json({ error: "Failed to fetch gallery pieces" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
