import { Request, Response } from 'express';
import multer, { FileFilterCallback, MulterError } from 'multer';
import path from 'path';
import { cloudinary, generateSignature, } from "../config/imageCloud";
import { UploadApiOptions } from 'cloudinary';




// Extend the Request interface to include 'file' and 'fileValidationError'
interface MulterRequest extends Request {
    file?: Express.Multer.File;
    fileValidationError?: string;
}

const storage = multer.memoryStorage();

const fileFilter = (req: MulterRequest, file: Express.Multer.File, cb: FileFilterCallback) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true); // Pass null for success cases
    } else {
        req.fileValidationError = 'Only JPEG, JPG, and PNG are allowed'; // Custom error handling
        cb(null, false); // Pass null and set false when the file is invalid
    }
};

const upload = multer({ storage: storage, fileFilter }).single('image');



export const uploadImage = (req: MulterRequest, res: Response): void => {
    upload(req, res, function (err: any) {
        if (err instanceof MulterError) {
            return res.status(500).json({ success: false, message: `Multer error: ${err.message}` });
        } else if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        if (req.fileValidationError) {
            return res.status(400).json({ success: false, message: req.fileValidationError });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        
     // Generate timestamp and signature
        const timestamp = Math.floor(Date.now()/1000);
        const public_id = `uploads/${req.file.originalname}`;

        const signature = generateSignature(timestamp,public_id);
        console.log("Uploading Image with Signature:", signature);

        const options: UploadApiOptions = {
            resource_type: "image",
            public_id: public_id,
            timestamp: timestamp,
            signature: signature,
            api_key: process.env.CLOUDINARY_API_KEY || "",  
        }
        console.log("Cloudinary Config:", cloudinary.config()); // Debugging

        cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          return res.status(500).json({ success: false, message: error.message });
        }

        res.status(200).json({
          success: true,
          message: "Image uploaded successfully",
          imageUrl: result?.secure_url,
        });
      })
       .end(req.file.buffer);
        
    });
};

