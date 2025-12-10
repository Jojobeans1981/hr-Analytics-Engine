const Sentiment = require('sentiment');
const natural = require('natural');

class SentimentAnalyzer {
  constructor() {
    this.sentiment = new Sentiment();
    this.tokenizer = new natural.WordTokenizer();
  }

  analyzeText(text) {
    const result = this.sentiment.analyze(text);
    
    return {
      score: result.score,
      comparative: result.comparative,
      sentiment: this.getSentimentLabel(result.score),
      positive: result.positive,
      negative: result.negative,
      words: result.words.length,
      confidence: this.calculateConfidence(result)
    };
  }

  analyzeEmployeeFeedback(employee) {
    const feedbackTexts = [
      employee.lastReview,
      ...(employee.comments || []),
      ...(employee.surveyResponses || [])
    ].filter(text => text && text.length > 0);

    if (feedbackTexts.length === 0) {
      return {
        overallSentiment: 'neutral',
        score: 0,
        breakdown: [],
        insights: ['No feedback data available']
      };
    }

    const analyses = feedbackTexts.map(text => this.analyzeText(text));
    
    const avgScore = analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length;
    const avgComparative = analyses.reduce((sum, a) => sum + a.comparative, 0) / analyses.length;

    return {
      overallSentiment: this.getSentimentLabel(avgScore),
      score: avgScore,
      comparative: avgComparative,
      breakdown: analyses,
      insights: this.generateInsights(analyses),
      keywords: this.extractKeywords(feedbackTexts)
    };
  }

  getSentimentLabel(score) {
    if (score > 5) return 'very positive';
    if (score > 0) return 'positive';
    if (score === 0) return 'neutral';
    if (score > -5) return 'negative';
    return 'very negative';
  }

  calculateConfidence(result) {
    // Confidence based on word count and score magnitude
    const wordFactor = Math.min(result.words / 50, 1);
    const scoreFactor = Math.min(Math.abs(result.score) / 10, 1);
    return Math.round((wordFactor * 0.4 + scoreFactor * 0.6) * 100);
  }

  generateInsights(analyses) {
    const insights = [];
    const negativeCount = analyses.filter(a => a.score < 0).length;
    const positiveCount = analyses.filter(a => a.score > 0).length;

    if (negativeCount > analyses.length * 0.6) {
      insights.push('Predominantly negative feedback - immediate attention needed');
    }
    if (positiveCount > analyses.length * 0.7) {
      insights.push('Highly positive feedback - potential brand ambassador');
    }

    const recentTrend = this.analyzeTrend(analyses.slice(-3));
    if (recentTrend === 'declining') {
      insights.push('Recent feedback shows declining sentiment');
    }

    return insights;
  }

  analyzeTrend(recentAnalyses) {
    if (recentAnalyses.length < 2) return 'insufficient data';
    
    const scores = recentAnalyses.map(a => a.score);
    const trend = scores[scores.length - 1] - scores[0];
    
    if (trend < -3) return 'declining';
    if (trend > 3) return 'improving';
    return 'stable';
  }

  extractKeywords(texts) {
    const tfidf = new natural.TfIdf();
    texts.forEach(text => tfidf.addDocument(text));
    
    const keywords = [];
    tfidf.listTerms(0).slice(0, 10).forEach(item => {
      if (item.term.length > 3) {
        keywords.push({
          term: item.term,
          score: item.tfidf
        });
      }
    });
    
    return keywords;
  }
}

module.exports = SentimentAnalyzer;