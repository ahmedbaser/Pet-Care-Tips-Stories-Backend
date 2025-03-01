import { Request } from 'express';
import mongoose from 'mongoose';
import { IUser } from '../models/User'; 

export interface AuthenticatedRequest extends Request {
  user?: IUser; // Use IUser type instead of defining a new structure
}
