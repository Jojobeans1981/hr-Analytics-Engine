export class SentimentAnalyzerService {
  static async analyze(text: string): Promise<any> {
    return { 
      sentiment: 'neutral', 
      score: 0.5,
      confidence: 0.8
    };
  }
}
