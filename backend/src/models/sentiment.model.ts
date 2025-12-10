import mongoose, { Document, Schema } from 'mongoose';

interface ISentiment extends Document {
  text: string;
  score: number;
  magnitude: number;
  analyzedAt: Date;
}

const SentimentSchema = new Schema({
  text: { type: String, required: true },
  score: { type: Number, required: true },
  magnitude: { type: Number, required: true },
  analyzedAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISentiment>('Sentiment', SentimentSchema);