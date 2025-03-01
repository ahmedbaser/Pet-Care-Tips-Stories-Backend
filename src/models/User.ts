import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    phone?: string; 
    address?: string; 
    role: string;
    isPremium?: boolean;
    following: mongoose.Types.ObjectId[]; 
    followers: mongoose.Types.ObjectId[];
    content?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    comparePassword: (password: string) => Promise<boolean>;
}  


const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    role: {type: String, default: "User"},
    phone: { type: String}, 
    address: { type: String, }, 
    isPremium: { type: Boolean, default: false }, 
    content: {type:String, default: null},
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    resetPasswordToken: { type: String, default: null }, 
    resetPasswordExpires: { type: Date, default: null },
});


// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});



// Compare hashed password
UserSchema.methods.comparePassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
