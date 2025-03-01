"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const multer_1 = __importStar(require("multer"));
const path_1 = __importDefault(require("path"));
const imageCloud_1 = require("../config/imageCloud");
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true); // Pass null for success cases
    }
    else {
        req.fileValidationError = 'Only JPEG, JPG, and PNG are allowed'; // Custom error handling
        cb(null, false); // Pass null and set false when the file is invalid
    }
};
const upload = (0, multer_1.default)({ storage: storage, fileFilter }).single('image');
const uploadImage = (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer_1.MulterError) {
            return res.status(500).json({ success: false, message: `Multer error: ${err.message}` });
        }
        else if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (req.fileValidationError) {
            return res.status(400).json({ success: false, message: req.fileValidationError });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        // Generate timestamp and signature
        const timestamp = Math.floor(Date.now() / 1000);
        const public_id = `uploads/${req.file.originalname}`;
        const signature = (0, imageCloud_1.generateSignature)(timestamp, public_id);
        console.log("Uploading Image with Signature:", signature);
        const options = {
            resource_type: "image",
            public_id: public_id,
            timestamp: timestamp,
            signature: signature,
            api_key: process.env.CLOUDINARY_API_KEY || "",
        };
        console.log("Cloudinary Config:", imageCloud_1.cloudinary.config()); // Debugging
        imageCloud_1.cloudinary.uploader
            .upload_stream(options, (error, result) => {
            if (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
            res.status(200).json({
                success: true,
                message: "Image uploaded successfully",
                imageUrl: result === null || result === void 0 ? void 0 : result.secure_url,
            });
        })
            .end(req.file.buffer);
    });
};
exports.uploadImage = uploadImage;
