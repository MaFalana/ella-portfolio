import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserInterface extends Document {
    email: string;
    password: string;
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<UserInterface>(
    {
        email: { 
            type: String, 
            required: true, 
            unique: true,
            lowercase: true,
            trim: true
        },
        password: { 
            type: String, 
            required: true 
        },
        role: { 
            type: String, 
            enum: ['admin', 'user'],
            default: 'user' 
        }
    },
    { 
        timestamps: true,
        collection: "Users"
    }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<UserInterface> =
    mongoose.models.User || mongoose.model<UserInterface>("User", UserSchema);

export default User;