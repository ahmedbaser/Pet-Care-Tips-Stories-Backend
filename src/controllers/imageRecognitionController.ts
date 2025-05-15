import { Request, Response } from "express";
import config from "../config";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PetAnalyzeSymptomImage } from "../models/AnalyzeSymptomImage";


interface AuthenticatedRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
  fileValidationError?: string;
}

const storage = multer.memoryStorage();



const fileFilter = (req: AuthenticatedRequest, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const isAllowed = allowedMimeTypes.includes(file.mimetype);

  if (isAllowed) {
    cb(null, true);
  } else {
    req.fileValidationError = 'Only JPG, JPEG, PNG files are allowed';
    cb(null, false);
  }
};



export const upload = multer({ storage, fileFilter }).single("image");

const genAI = new GoogleGenerativeAI(config.gemini_api_key as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const analyzeSymptomImage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    const {petType, petAge, symptomDescription, customInputs } = req.body;
    const imageFile = req.file;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
   }


   
    if (req.fileValidationError) {
      return res.status(400).json({ success: false, message: req.fileValidationError });
    }

    if (!imageFile) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const base64Image = imageFile.buffer.toString("base64");
    const mimeType = imageFile.mimetype;

    const userPrompt = `
        This is an image of a ${petAge}-year-old ${petType}.
        ${symptomDescription ? `User description of symptoms: ${symptomDescription}.` : ""}
        Additional Info: ${customInputs ? JSON.stringify(customInputs) : "None"}
        
        Based on this image and info, provide:
        - Whether the situation is urgent or not
        - Possible causes of the symptoms
        - Recommended next steps
        `.trim();

    const result = await model.generateContent([
      userPrompt,
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const analysisResult = response.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis generated.";


     const PetAnalyzeSymptom = new PetAnalyzeSymptomImage({
        userId,
        petType,
        petAge,
        symptomDescription,
        customInputs,
        analysisResult,
     })

    await PetAnalyzeSymptom.save();
    
    return res.status(200).json({
      message: "Image analyzed successfully",
      analysis: PetAnalyzeSymptom.analysisResult,
    });
  } catch (error) {
    console.error("Gemini AI Vision error:", error);
    return res.status(500).json({ error: "Failed to analyze image with AI" });
  }
};
