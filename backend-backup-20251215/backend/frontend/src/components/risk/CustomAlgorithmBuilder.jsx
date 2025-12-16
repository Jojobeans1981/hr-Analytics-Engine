import React, { useState } from 'react';
import './CustomAlgorithmBuilder.css';

const CustomAlgorithmBuilder = ({ onSaveAlgorithm }) => {
  const [algorithmName, setAlgorithmName] = useState('');
  const [factors, setFactors] = useState([]);
  const [rules, setRules] = useState([]);
  const [newFactor, setNewFactor] = useState({
    name: '',
    weight: 0.1,
    calculator: ''
  });
  const [newRule, setNewRule] = useState({
    name: '',
    condition: '',
    adjustment: 10
  });

  const predefinedCalculators = [
    { id: 'tenure', name: 'Tenure Risk', description: 'Calculates risk based on employment duration' },
    { id: 'performance', name: 'Performance Risk', description: 'Calculates risk based on performance scores' },
    { id: 'market', name: 'Market Demand', description: 'Calculates risk based on market demand for skills' },
    { id: 'engagement', name: 'Engagement', description: 'Calculates risk based on engagement scores' },
    { id: 'compensation', name: 'Compensation', description: 'Calculates risk based on compensation ratio' }
  ];

  const addFactor = () => {
    if (!newFactor.name || !newFactor.calculator) return;
    
    setFactors([...factors, { ...newFactor, id: Date.now() }]);
    setNewFactor({ name: '', weight: 0.1, calculator: '' });
  };

  const removeFactor = (id) => {
    setFactors(factors.filter(f => f.id !== id));
  };

  const addRule = () => {
    if (!newRule.name || !newRule.condition) return;
    
    setRules([...rules, { ...newRule, id: Date.now() }]);
    setNewRule({ name: '', condition: '', adjustment: 10 });
  };

  const removeRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const saveAlgorithm = () => {
    if (!algorithmName || factors.length === 0) {
      alert('Please provide algorithm name and at least one factor');
      return;
    }

    const algorithmConfig = {
      name: algorithmName,
      factors: factors.reduce((acc, factor) => {
        acc[factor.name] = {
          calculator: factor.calculator,
          weight: factor.weight
        };
        return acc;
      }, {}),
      rules: rules.map(rule => ({
        name: rule.name,
        condition: rule.condition,
        adjustment: rule.adjustment
      }))
    };

    if (onSaveAlgorithm) {
      onSaveAlgorithm(algorithmConfig);
    }
  };

  return (
    <div className="algorithm-builder">
      <div className="builder-header">
        <h3>Custom Algorithm Builder</h3>
        <p>Create custom risk scoring algorithms tailored to your organization</p>
      </div>

      <div className="algorithm-name">
        <label>Algorithm Name</label>
        <input
          type="text"
          value={algorithmName}
          onChange={(e) => setAlgorithmName(e.target.value)}
          placeholder="e.g., Engineering Retention Algorithm"
        />
      </div>

      <div className="builder-section">
        <h4>Factors</h4>
        <p className="section-description">
          Define the factors that contribute to risk score and their weights.
          Total weight should ideally sum to 1.0.
        </p>

        <div className="add-factor">
          <div className="factor-inputs">
            <input
              type="text"
              placeholder="Factor Name (e.g., tenure_risk)"
              value={newFactor.name}
              onChange={(e) => setNewFactor({ ...newFactor, name: e.target.value })}
            />
            <select
              value={newFactor.calculator}
              onChange={(e) => setNewFactor({ ...newFactor, calculator: e.target.value })}
            >
              <option value="">Select Calculator</option>
              {predefinedCalculators.map(calc => (
                <option key={calc.id} value={calc.id}>
                  {calc.name} - {calc.description}
                </option>
              ))}
              <option value="custom">Custom JavaScript Function</option>
            </select>
            <input
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={newFactor.weight}
              onChange={(e) => setNewFactor({ ...newFactor, weight: parseFloat(e.target.value) })}
              placeholder="Weight"
            />
            <button onClick={addFactor}>Add Factor</button>
          </div>
        </div>

        {factors.length > 0 && (
          <div className="factors-list">
            <div className="factors-header">
              <span>Name</span>
              <span>Calculator</span>
              <span>Weight</span>
              <span>Actions</span>
            </div>
            {factors.map(factor => (
              <div key={factor.id} className="factor-item">
                <span>{factor.name}</span>
                <span className="calculator">
                  {predefinedCalculators.find(c => c.id === factor.calculator)?.name || 'Custom'}
                </span>
                <span>{factor.weight}</span>
                <button 
                  className="remove-btn"
                  onClick={() => removeFactor(factor.id)}
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="weight-total">
              <span>Total Weight:</span>
              <span className={factors.reduce((sum, f) => sum + f.weight, 0) === 1 ? 'valid' : 'invalid'}>
                {factors.reduce((sum, f) => sum + f.weight, 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="builder-section">
        <h4>Rules</h4>
        <p className="section-description">
          Define rules that adjust scores based on specific conditions.
        </p>

        <div className="add-rule">
          <div className="rule-inputs">
            <input
              type="text"
              placeholder="Rule Name (e.g., active_job_search)"
              value={newRule.name}
              onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Condition (e.g., factors.activeJobSearch === true)"
              value={newRule.condition}
              onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
            />
            <input
              type="number"
              value={newRule.adjustment}
              onChange={(e) => setNewRule({ ...newRule, adjustment: parseInt(e.target.value) })}
              placeholder="Score Adjustment"
            />
            <button onClick={addRule}>Add Rule</button>
          </div>
        </div>

        {rules.length > 0 && (
          <div className="rules-list">
            <div className="rules-header">
              <span>Name</span>
              <span>Condition</span>
              <span>Adjustment</span>
              <span>Actions</span>
            </div>
            {rules.map(rule => (
              <div key={rule.id} className="rule-item">
                <span>{rule.name}</span>
                <code className="condition">{rule.condition}</code>
                <span>{rule.adjustment > 0 ? '+' : ''}{rule.adjustment}</span>
                <button 
                  className="remove-btn"
                  onClick={() => removeRule(rule.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="preview-section">
        <h4>Algorithm Preview</h4>
        <div className="preview-code">
          <pre>{JSON.stringify({
            name: algorithmName,
            factors: factors.reduce((acc, f) => ({
              ...acc,
              [f.name]: {
                calculator: f.calculator,
                weight: f.weight
              }
            }), {}),
            rules: rules.map(r => ({
              name: r.name,
              condition: r.condition,
              adjustment: r.adjustment
            }))
          }, null, 2)}</pre>
        </div>
      </div>

      <div className="builder-actions">
        <button className="save-btn" onClick={saveAlgorithm}>
          Save Algorithm
        </button>
        <button className="test-btn">
          Test with Sample Data
        </button>
      </div>
    </div>
  );
};

export default CustomAlgorithmBuilder;
