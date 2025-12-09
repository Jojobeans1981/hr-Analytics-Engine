// src/models/token.model.ts
import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' }
});

export const Token = mongoose.model('Token', tokenSchema);