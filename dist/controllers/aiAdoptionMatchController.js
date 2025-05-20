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
exports.getPetAdoption = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../config"));
const PetAdoptionMatch_1 = __importDefault(require("../models/PetAdoptionMatch"));
const getPetAdoption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { pets, user } = req.body;
        if (!user || !pets || !Array.isArray(pets)) {
            return res.status(400).json({ error: 'User and pets data are required.' });
        }
        const userSummary = `Name: ${user.name}
         Age: ${user.age}
         LifeStyle: ${user.lifestyle} 
         Allergies: ${user.allergies}
         Home Environment: ${user.home}
         Experience with Pets: ${user.experienceWithPets}
        `.trim();
        const petSummaries = pets.map((pet, index) => {
            return `
            Pet ${index + 1}:
            - Name: ${pet.name}
            - Breed: ${pet.breed}
            - Size: ${pet.size}
            - Temperament: ${pet.temperament}
            - Needs: ${pet.needs}
           `.trim();
        }).join("\n\n");
        const openai = new openai_1.default({ apiKey: config_1.default.openai_api_key });
        const prompt = `
        You are an expert pet adoption counselor.Based on the following user and pet information, suggest the best pet(s) for the user to adopt and explain your reasoning clearly.

        User Details:
        ${userSummary}

        Available Pets:
        ${petSummaries}

        Provide:
        1. Recommend pet(s) to adopt
        2. Reasons why each recommend pet is a good fit Respond in friendly and encouraging tone.
       `.trim();
        const completion = yield openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a professional pet adoption counselor.' },
                { role: 'user', content: prompt }
            ],
        });
        const matchSuggestion = ((_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || 'No suggestion available.';
        const newPetAdoptionMatch = new PetAdoptionMatch_1.default({
            // userId: user.id,
            userId: req.userId,
            suggestion: matchSuggestion,
        });
        yield newPetAdoptionMatch.save();
        return res.status(201).json({
            message: 'Pet adoption match generated successfully',
            data: newPetAdoptionMatch,
        });
    }
    catch (error) {
        console.error('Pet Adoption Match Error:', error);
        return res.status(500).json({ error: 'Failed to generate adoption match.' });
    }
});
exports.getPetAdoption = getPetAdoption;
