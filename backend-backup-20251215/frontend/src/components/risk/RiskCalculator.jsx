import React, { useState } from 'react';
import { employeeAPI } from '../../services/api';
import './RiskCalculator.css';

const RiskCalculator = ({ employee, onCalculate }) => {
  const [algorithm, setAlgorithm] = useState('auto');
  const [factors, setFactors] = useState({
    marketDemand: 50,
    compensationRatio: 1.0,
    engagement: 50,
    lastPromotion: 24,
    monthsSinceRaise: 24,
    skillRarity: 'common'
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const algorithms = [
    { value: 'auto', label: 'Auto-select (Recommended)' },
    { value: 'basic', label: 'Basic Algorithm' },
    { value: 'advanced', label: 'Advanced Predictive' },
    { value: 'engineering', label: 'Engineering Specific' },
    { value: 'sales', label: 'Sales Specific' },
    { value: 'leadership', label: 'Leadership Specific' }
  ];
  
  const skillRarityOptions = [
    { value: 'common', label: 'Common' },
    { value: 'specialized', label: 'Specialized' },
    { value: 'rare', label: 'Rare' },
    { value: 'critical', label: 'Critical' }
  ];
  
  const handleFactorChange = (key, value) => {
    setFactors(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const calculateRisk = async () => {
    if (!employee || !employee._id) {
      setError('No employee selected');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await employeeAPI.calculateRisk(employee._id, {
        algorithm,
        factors,
        employeeData: employee
      });
      
      setResult(response.data);
      
      if (onCalculate) {
        onCalculate(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to calculate risk score');
    } finally {
      setLoading(false);
    }
  };
  
  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return '#ef4444';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW': return '#10b981';
      default: return '#6b7280';
    }
  };
  
  return (
    <div className="risk-calculator">
      <div className="calculator-header">
        <h3>Risk Score Calculator</h3>
        <p>Calculate risk score for {employee?.name}</p>
      </div>
      
      <div className="calculator-body">
        <div className="algorithm-selection">
          <label htmlFor="algorithm">Algorithm</label>
          <select
            id="algorithm"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={loading}
          >
            {algorithms.map(algo => (
              <option key={algo.value} value={algo.value}>
                {algo.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="factors-grid">
          <div className="factor">
            <label>Market Demand</label>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="100"
                value={factors.marketDemand}
                onChange={(e) => handleFactorChange('marketDemand', parseInt(e.target.value))}
                disabled={loading}
              />
              <span className="slider-value">{factors.marketDemand}%</span>
            </div>
          </div>
          
          <div className="factor">
            <label>Compensation Ratio</label>
            <div className="slider-container">
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={factors.compensationRatio}
                onChange={(e) => handleFactorChange('compensationRatio', parseFloat(e.target.value))}
                disabled={loading}
              />
              <span className="slider-value">{factors.compensationRatio.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="factor">
            <label>Engagement Score</label>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="100"
                value={factors.engagement}
                onChange={(e) => handleFactorChange('engagement', parseInt(e.target.value))}
                disabled={loading}
              />
              <span className="slider-value">{factors.engagement}%</span>
            </div>
          </div>
          
          <div className="factor">
            <label>Months Since Last Promotion</label>
            <input
              type="number"
              min="0"
              max="120"
              value={factors.lastPromotion}
              onChange={(e) => handleFactorChange('lastPromotion', parseInt(e.target.value))}
              disabled={loading}
            />
          </div>
          
          <div className="factor">
            <label>Months Since Last Raise</label>
            <input
              type="number"
              min="0"
              max="120"
              value={factors.monthsSinceRaise}
              onChange={(e) => handleFactorChange('monthsSinceRaise', parseInt(e.target.value))}
              disabled={loading}
            />
          </div>
          
          <div className="factor">
            <label>Skill Rarity</label>
            <select
              value={factors.skillRarity}
              onChange={(e) => handleFactorChange('skillRarity', e.target.value)}
              disabled={loading}
            >
              {skillRarityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          className="calculate-btn"
          onClick={calculateRisk}
          disabled={loading || !employee}
        >
          {loading ? 'Calculating...' : 'Calculate Risk Score'}
        </button>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {result && (
          <div className="result-display">
            <div className="result-header">
              <h4>Risk Calculation Result</h4>
              <span className="algorithm-used">
                Algorithm: {result.algorithmUsed}
              </span>
            </div>
            
            <div className="score-display">
              <div className="score-circle" style={{ borderColor: getRiskColor(result.riskLevel) }}>
                <span className="score-value">{result.score}</span>
                <span className="score-label">Risk Score</span>
              </div>
              
              <div className="risk-level" style={{ color: getRiskColor(result.riskLevel) }}>
                <span className="level-label">Risk Level:</span>
                <span className="level-value">{result.riskLevel}</span>
              </div>
            </div>
            
            {result.factors && (
              <div className="factor-breakdown">
                <h5>Factor Breakdown</h5>
                <div className="factors-list">
                  {Object.entries(result.factors).map(([factor, score]) => (
                    <div key={factor} className="factor-item">
                      <span className="factor-name">{factor}:</span>
                      <div className="factor-bar-container">
                        <div 
                          className="factor-bar" 
                          style={{ 
                            width: `${score}%`,
                            backgroundColor: score > 70 ? '#ef4444' : score > 40 ? '#f59e0b' : '#10b981'
                          }}
                        ></div>
                        <span className="factor-score">{Math.round(score)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {result.insights && result.insights.length > 0 && (
              <div className="insights">
                <h5>Key Insights</h5>
                {result.insights.map((insight, index) => (
                  <div key={index} className={`insight insight-${insight.level}`}>
                    <strong>{insight.level.toUpperCase()}:</strong> {insight.message}
                  </div>
                ))}
              </div>
            )}
            
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="recommendations">
                <h5>Recommendations</h5>
                <ul>
                  {result.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskCalculator;
