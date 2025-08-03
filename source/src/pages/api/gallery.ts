import type { NextApiResponse } from 'next';
import { connectDB, GalleryModel } from '@/managers/PortfolioManager';
import { authMiddleware, AuthenticatedRequest } from '@/middleware/authMiddleware';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Disable Next.js body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// GET /api/gallery - Get all gallery items
async function handleGet(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const items = await GalleryModel.find().sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
}

// POST /api/gallery - Create new gallery item (with image upload)
async function handlePost(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public/uploads'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const [fields, files] = await form.parse(req);
    
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const medium = Array.isArray(fields.medium) ? fields.medium[0] : fields.medium;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const height = Array.isArray(fields.height) ? parseInt(fields.height[0]) : parseInt(fields.height || '400');

    // Handle image upload
    let imagePath = '/assets/placeholder.jpg'; // Default fallback
    
    if (files.image && !Array.isArray(files.image)) {
      const file = files.image;
      const filename = `${uuidv4()}-${file.originalFilename}`;
      const newPath = path.join(uploadDir, filename);
      
      // Move uploaded file to permanent location
      fs.renameSync(file.filepath, newPath);
      imagePath = `/uploads/${filename}`;
    }

    const newItem = new GalleryModel({
      title,
      medium,
      description,
      height,
      img: imagePath,
      url: imagePath, // For compatibility
    });

    const savedItem = await newItem.save();
    return res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return res.status(500).json({ error: 'Failed to create gallery item' });
  }
}

// PUT /api/gallery - Update existing gallery item
async function handlePut(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const { id, title, medium, description, height } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Item ID is required' });
    }

    const updatedItem = await GalleryModel.findByIdAndUpdate(
      id,
      { title, medium, description, height },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return res.status(500).json({ error: 'Failed to update gallery item' });
  }
}

// DELETE /api/gallery - Delete gallery item
async function handleDelete(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Item ID is required' });
    }

    const deletedItem = await GalleryModel.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    // Clean up uploaded image file
    if (deletedItem.img && deletedItem.img.startsWith('/uploads/')) {
      const imagePath = path.join(process.cwd(), 'public', deletedItem.img);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    return res.status(200).json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return res.status(500).json({ error: 'Failed to delete gallery item' });
  }
}

export default authMiddleware(handler, { requireAdmin: true });