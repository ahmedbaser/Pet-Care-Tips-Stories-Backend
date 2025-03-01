import { Router } from "express";
import { generatePetStory } from "../controllers/storyGeneratorController";

const  storyGeneratorRouter = Router();

storyGeneratorRouter.post('/generate-story', generatePetStory);

export default storyGeneratorRouter;
