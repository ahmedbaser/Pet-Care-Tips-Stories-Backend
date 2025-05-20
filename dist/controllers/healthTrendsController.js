"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPetHealthPrediction = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../config"));
const petHealthPrediction_1 = require("../models/petHealthPrediction");
const getPetHealthPrediction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = req.userId;
        const { petName, species, breed, age, weight, gender, activityLevel, diet, vaccinationStatus, pastIllnesses, currentSymptoms, lastVetVisit, medications, spayedNeutered, customInputs } = req.body;
        if (!petName || !species || !age || !weight) {
            return res.status(400).json({ error: "Pet name, species, age, and weight are required." });
        }
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        const openai = new openai_1.default({
            apiKey: config_1.default.openai_api_key,
        });
        // custom input if user's want to take input by own as well 
        let customInfo = "";
        if (customInputs && typeof customInputs == "object") {
            customInfo = Object.entries(customInputs).map(([key, value]) => `-${key}: ${value}`).join('\n');
        }
        const prompt = `
      You are an experienced veterinarian and pet health analyst.
      Analyze the following pet's current health data and predict potential health risks over the next year.
      Also suggest 3 personalized health tips.

      Pet Information:
      - Name: ${petName}
      - Species: ${species}
      - Breed: ${breed || "Unknown"}
      - Age: ${age} years
      - Weight: ${weight} kg
      - Gender: ${gender || "Unknown"}
      - Activity Level: ${activityLevel || "Unknown"}
      - Diet: ${diet || "Unknown"}
      - Vaccination Status: ${vaccinationStatus || 'Unknown'}
      - Past Illnesses: ${pastIllnesses || "None"}
      - Current Symptoms: ${currentSymptoms === null || currentSymptoms === void 0 ? void 0 : currentSymptoms.length}
      - Last Vet Visit: ${lastVetVisit || "Unknown"}
      - Medications: ${medications}
      - Spayed/Neutered: ${spayedNeutered ? "Yes" : "No"}
      
      Additional Info Provide by User: ${customInfo || "None"}

      Please predict:
      1. Likely health risks to monitor
      2. Early warning signs for the owner
      3. preventive health tips customized to this pet.
      `.trim();
        const completion = yield openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a profession veterinarian providing predictive health analysis and preventive advice for pets.'
                },
                {
                    role: 'user',
                    content: prompt,
                }
            ],
        });
        const healthPrediction = ((_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || 'No prediction generated.';
        const newHealthPrediction = new petHealthPrediction_1.PetHealthPrediction({
            userId,
            petName,
            species,
            breed,
            age,
            weight,
            gender,
            activityLevel,
            diet,
            vaccinationStatus,
            pastIllnesses,
            currentSymptoms,
            lastVetVisit,
            medications,
            spayedNeutered,
            customInputs,
            suggestion: healthPrediction
        });
        yield newHealthPrediction.save();
        return res.status(201).json({
            message: 'Pet health prediction generated successfully',
            data: newHealthPrediction.suggestion,
        });
    }
    catch (error) {
        console.error("Pet health prediction error:", error);
        return res.status(500).json({ error: 'Failed to generate pet ' });
    }
});
exports.getPetHealthPrediction = getPetHealthPrediction;
