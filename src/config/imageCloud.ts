import { v2 as cloudinary } from "cloudinary";
import crypto from 'crypto';
import dotenv from "dotenv"

dotenv.config();

// Cloudinary api key
console.log("Cloudinary API Key:", process.env.CLOUDINARY_API_KEY);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
});


const generateSignature = (timestamp: number, public_id: string) => {
    const signatureString = `public_id=${public_id}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex'); 

    // Debugging
    console.log("Corrected Signature String:", signatureString);
    console.log("Corrected Generated Signature:", signature);

    return signature;
};


export {cloudinary, generateSignature};