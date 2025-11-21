"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentimentController = void 0;
class SentimentController {
    static async analyzeText(req, res) {
        try {
            const { text } = req.body;
            if (!text || typeof text !== 'string') {
                res.status(400).json({
                    success: false,
                    error: 'Valid text is required for sentiment analysis'
                });
                return;
            }
            // Simple sentiment analysis implementation
            const positiveWords = ['good', 'great', 'excellent', 'amazing', 'happy', 'positive'];
            const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'sad', 'negative'];
            const words = text.toLowerCase().split(/\s+/);
            let positiveCount = 0;
            let negativeCount = 0;
            words.forEach(word => {
                if (positiveWords.includes(word))
                    positiveCount++;
                if (negativeWords.includes(word))
                    negativeCount++;
            });
            const totalSentimentWords = positiveCount + negativeCount;
            let sentiment = 'neutral';
            let score = 0.5;
            if (totalSentimentWords > 0) {
                score = positiveCount / totalSentimentWords;
                sentiment = score > 0.6 ? 'positive' : score < 0.4 ? 'negative' : 'neutral';
            }
            const result = {
                sentiment,
                score: Math.round(score * 100) / 100,
                confidence: Math.min(0.8 + (Math.abs(score - 0.5) * 0.4), 0.95),
                positiveWords: positiveCount,
                negativeWords: negativeCount,
                analyzedText: text.substring(0, 100) + (text.length > 100 ? '...' : '')
            };
            res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            console.error('Sentiment analysis error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to analyze sentiment'
            });
        }
    }
    static async analyzeTeamSentiment(req, res) {
        try {
            const { teamId } = req.params;
            // Temporary implementation for team sentiment
            const teamSentiment = {
                teamId,
                overallSentiment: 'positive',
                averageScore: 7.4,
                communicationScore: 8.2,
                collaborationScore: 7.8,
                moraleScore: 6.9,
                recommendations: [
                    'Improve team communication',
                    'Address workload concerns',
                    'Enhance recognition programs'
                ]
            };
            res.json({
                success: true,
                data: teamSentiment
            });
        }
        catch (error) {
            console.error('Team sentiment error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to analyze team sentiment'
            });
        }
    }
}
exports.SentimentController = SentimentController;
