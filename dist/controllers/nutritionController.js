"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNutritionPDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
// Calculate nutrition needs based on pet's age and weight
const generateNutritionPDF = (req, res) => {
    const { age, weight } = req.body;
    // Sample logic for calculating nutrition needs (customize this as needed)
    const nutritionData = {
        protein: (weight * 0.03).toFixed(2), // Example: 3% of weight for protein
        fat: (weight * 0.02).toFixed(2), // Example: 2% of weight for fat
        carbs: (weight * 0.04).toFixed(2) // Example: 4% of weight for carbs
    };
    // Create a PDF document
    const doc = new pdfkit_1.default();
    let filename = `nutrition_${Date.now()}.pdf`;
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', 'application/pdf');
    // Add content to the PDF
    doc.text(`Nutrition Plan for Pet`);
    doc.text(`Age: ${age} years`);
    doc.text(`Weight: ${weight} kg`);
    doc.text(`Protein Requirement: ${nutritionData.protein} kg`);
    doc.text(`Fat Requirement: ${nutritionData.fat} kg`);
    doc.text(`Carb Requirement: ${nutritionData.carbs} kg`);
    // Pipe the document to the response
    doc.pipe(res);
    doc.end();
};
exports.generateNutritionPDF = generateNutritionPDF;
