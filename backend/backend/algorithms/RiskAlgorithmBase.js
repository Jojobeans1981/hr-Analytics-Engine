// Abstract base class for all risk algorithms
class RiskAlgorithmBase {
  constructor(config = {}) {
    this.config = config;
    this.weights = config.weights || {};
  }
  
  /**
   * Calculate risk score for an employee
   * @param {Object} employeeData - Employee data
   * @param {Object} factors - Risk factors
   * @returns {Object} Risk calculation result
   */
  calculate(employeeData, factors) {
    throw new Error('calculate() must be implemented by subclass');
  }
  
  /**
   * Validate input data
   * @param {Object} data - Input data
   * @returns {Object} Validation result
   */
  validateData(data) {
    const errors = [];
    
    if (!data.employeeId) errors.push('employeeId is required');
    if (!data.department) errors.push('department is required');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Normalize score to 0-100 range
   * @param {number} score - Raw score
   * @param {number} maxScore - Maximum possible score
   * @returns {number} Normalized score
   */
  normalizeScore(score, maxScore = 1) {
    return Math.min(100, Math.max(0, (score / maxScore) * 100));
  }
  
  /**
   * Determine risk level from score
   * @param {number} score - Risk score
   * @returns {string} Risk level
   */
  getRiskLevel(score) {
    if (score >= 70) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
  }
  
  /**
   * Apply weight to factor
   * @param {number} value - Factor value
   * @param {number} weight - Factor weight
   * @returns {number} Weighted value
   */
  applyWeight(value, weight) {
    return value * weight;
  }
}

module.exports = RiskAlgorithmBase;
