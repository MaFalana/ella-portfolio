import mongoose, { ConnectOptions } from "mongoose";
import Gallery, { GalleryInterface } from "./Models";

// Profile Schema
const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  experience: [{
    title: String,
    company: String,
    period: String,
    description: String
  }],
  education: [{
    degree: String,
    school: String,
    year: String,
    description: String
  }],
  skills: [String],
  services: [String]
}, { 
  timestamps: true 
});

// Export models for use in API routes
export const GalleryModel = Gallery;
export const ProfileModel = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

// Connection helper function
export const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    const url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.wnhyqbg.mongodb.net/${process.env.MONGO_DB}`;
    await mongoose.connect(url, { 
      serverApi: { version: "1", strict: true, deprecationErrors: true }
    });
  }
};
class PortfolioManager 
{
    //const uri = "mongodb+srv://mfalana:<db_password>@cluster0.wnhyqbg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    //const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

    private static instance: PortfolioManager; // Singleton instance
    private url: string;
    private clientOptions: ConnectOptions;
    private isConnected: boolean = false;

    constructor() 
    {
        this.url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.wnhyqbg.mongodb.net/${process.env.MONGO_DB}`;
        console.log("Connecting to MongoDB at:", this.url);
        this.clientOptions = { serverApi: { version: "1", strict: true, deprecationErrors: true }};

        //this.getGalleryPieces = getGalleryPieces
    }

    static getInstance() 
    {
        if (!PortfolioManager.instance) 
        {
            PortfolioManager.instance = new PortfolioManager();
        }
        return PortfolioManager.instance;
    }
    
    async connect() // Connect to MongoDB
    {
        if (mongoose.connection.readyState === 0) 
        {
            try 
            {
                await mongoose.connect(this.url, this.clientOptions);
                console.log("Connected to MongoDB");
            } 
            catch (err) 
            {
                console.error("MongoDB connection error:", err);
                throw err;
            }
        }
    }
    
    async disconnect() // Disconnect from MongoDB
    {
        if (mongoose.connection.readyState !== 0) 
        {
            await mongoose.disconnect();
            console.log("Disconnected from MongoDB");
        }
    }

    public async getGalleryPieces(): Promise<GalleryInterface[]> 
    {   
        await this.connect();
        try
        {
            //const Gallery = await mongoose.model("Gallery", GallerySchema); // Ensure the model is defined
            const pieces = await Gallery.find().exec(); // Fetch all gallery pieces
            console.log("Gallery pieces fetched successfully:", pieces.length);
            // log database collections
            //const collections = await mongoose.connection.db.listCollections().toArray();
            //console.log("Collections in the database:", collections.map(c => c.name));
            return pieces;
        }
        catch (err) 
        {
            console.error("Error fetching gallery pieces:", err);
            return [];
        }
        // finally
        // {
        //     await this.disconnect(); // Ensure disconnection in case of error or success
        // }
    }
}

export default PortfolioManager.getInstance();

