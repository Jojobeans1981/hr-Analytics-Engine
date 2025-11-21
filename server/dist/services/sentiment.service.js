"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentimentAnalyzerService = void 0;
class SentimentAnalyzerService {
    static async analyze(text) {
        return {
            sentiment: 'neutral',
            score: 0.5,
            confidence: 0.8
        };
    }
}
exports.SentimentAnalyzerService = SentimentAnalyzerService;
