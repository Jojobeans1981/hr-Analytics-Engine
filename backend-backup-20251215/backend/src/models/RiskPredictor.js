const tf = require('@tensorflow/tfjs-node');
const path = require('path');

class RiskPredictor {
  constructor() {
    this.model = null;
    this.isReady = false;
    this.initializeModel();
  }

  async initializeModel() {
    try {
      // Try to load existing model
      const modelPath = path.join(__dirname, '../../models/risk-model');
      this.model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
      this.isReady = true;
      console.log('Loaded existing model');
    } catch (error) {
      // Create new model if none exists
      console.log('Creating new model...');
      await this.createAndTrainModel();
    }
  }

  async createAndTrainModel() {
    // Create a simple neural network
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [8], units: 16, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    // Generate synthetic training data (in production, use real data)
    const trainingData = this.generateTrainingData(1000);
    
    // Train the model
    await this.model.fit(trainingData.inputs, trainingData.outputs, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 10 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}`);
          }
        }
      }
    });

    // Save the model
    await this.saveModel();
    this.isReady = true;
  }

  generateTrainingData(samples) {
    const inputs = [];
    const outputs = [];

    for (let i = 0; i < samples; i++) {
      // Generate realistic employee features
      const tenure = Math.random() * 10; // Years
      const performanceScore = Math.random() * 100;
      const salaryPercentile = Math.random() * 100;
      const promotionYears = Math.random() * 5;
      const workLifeBalance = Math.random() * 100;
      const jobSatisfaction = Math.random() * 100;
      const trainingHours = Math.random() * 100;
      const engagementScore = Math.random() * 100;

      // Simple rule-based risk calculation for training
      let risk = 0;
      if (tenure < 2) risk += 0.3;
      if (performanceScore < 60) risk += 0.2;
      if (salaryPercentile < 30) risk += 0.2;
      if (promotionYears > 3) risk += 0.1;
      if (workLifeBalance < 40) risk += 0.1;
      if (jobSatisfaction < 50) risk += 0.1;

      // Add some noise
      risk = Math.min(1, Math.max(0, risk + (Math.random() - 0.5) * 0.2));

      inputs.push([
        tenure / 10,
        performanceScore / 100,
        salaryPercentile / 100,
        promotionYears / 5,
        workLifeBalance / 100,
        jobSatisfaction / 100,
        trainingHours / 100,
        engagementScore / 100
      ]);

      outputs.push([risk]);
    }

    return {
      inputs: tf.tensor2d(inputs),
      outputs: tf.tensor2d(outputs)
    };
  }

  async predict(employeeData) {
    if (!this.isReady) {
      throw new Error('Model not ready');
    }

    const input = tf.tensor2d([[
      employeeData.tenure / 10,
      employeeData.performanceScore / 100,
      employeeData.salaryPercentile / 100,
      employeeData.promotionYears / 5,
      employeeData.workLifeBalance / 100,
      employeeData.jobSatisfaction / 100,
      employeeData.trainingHours / 100,
      employeeData.engagementScore / 100
    ]]);

    const prediction = await this.model.predict(input).data();
    input.dispose();

    const riskScore = prediction[0];
    const riskLevel = this.getRiskLevel(riskScore);
    const factors = this.analyzeRiskFactors(employeeData, riskScore);

    return {
      score: Math.round(riskScore * 100),
      level: riskLevel,
      factors: factors,
      confidence: this.calculateConfidence(employeeData)
    };
  }

  getRiskLevel(score) {
    if (score > 0.7) return 'high';
    if (score > 0.4) return 'medium';
    return 'low';
  }

  analyzeRiskFactors(data, score) {
    const factors = [];
    
    if (data.tenure < 2) factors.push('New employee (< 2 years)');
    if (data.performanceScore < 60) factors.push('Below average performance');
    if (data.salaryPercentile < 30) factors.push('Below market salary');
    if (data.promotionYears > 3) factors.push('Long time without promotion');
    if (data.workLifeBalance < 40) factors.push('Poor work-life balance');
    if (data.jobSatisfaction < 50) factors.push('Low job satisfaction');

    return factors;
  }

  calculateConfidence(data) {
    // Calculate confidence based on data completeness
    const fields = Object.values(data).filter(v => v !== null && v !== undefined);
    return Math.round((fields.length / 8) * 100);
  }

  async saveModel() {
    const savePath = path.join(__dirname, '../../models/risk-model');
    await this.model.save(`file://${savePath}`);
    console.log('Model saved successfully');
  }
}

module.exports = RiskPredictor;