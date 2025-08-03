import mongoose, { Document, Model } from "mongoose";

// 1) Define the TypeScript interface (extends mongoose.Document)
export interface GalleryInterface extends Document {
    id: string;          // Make required if schema has `required: true`
    title: string;
    description?: string;
    height?: BigInt;
    medium: string;
    url: string;
    img: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// 2) Define the schema
const GallerySchema = new mongoose.Schema<GalleryInterface>(
    {
        id: { type: String, required: true, unique: true },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        height: { type: Number, default: 100 },
        medium: { type: String, required: true },
        url: { type: String, required: true, default: "" },
        img: { type: String, required: true },
    },
    { 
        timestamps: true,
        collection: "Gallery" // Specify the collection name
    }
);

// 3) Export a typed model (avoids Next.js hot reload errors)
const Gallery: Model<GalleryInterface> =
    mongoose.models.Gallery || mongoose.model<GalleryInterface>("Gallery", GallerySchema);

export default Gallery;
