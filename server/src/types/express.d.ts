import { User } from "../models/User"; // Adjust path to your User model

declare global {
  namespace Express {
    interface Request {
      user?: User & { id: string }; // Add whatever shape your middleware attaches
    }
  }
}