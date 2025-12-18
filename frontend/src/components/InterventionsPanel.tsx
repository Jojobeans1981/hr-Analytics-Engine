import React from 'react';
import './EmployeeDashboard.css';

interface DepartmentAnalysis {
  name: string;
  employeeCount: number;
  avgRiskScore: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  topRiskFactors: string[];
  suggestedInterventions: string[];
}

interface InterventionsPanelProps {
  departmentAnalysis: DepartmentAnalysis[];
}

const InterventionsPanel: React.FC<InterventionsPanelProps> = ({ departmentAnalysis }) => {
  const totalInterventions = departmentAnalysis.reduce((sum, dept) => sum + dept.suggestedInterventions.length, 0);
  
  // Flatten all interventions with department info
  const allInterventions = departmentAnalysis.flatMap(dept => 
    dept.suggestedInterventions.map(intervention => ({
      department: dept.name,
      intervention,
      riskScore: dept.avgRiskScore,
      highRiskCount: dept.highRiskCount
    }))
  );

  // Group by priority (simplified - departments with higher risk scores get priority)
  const highPriorityInterventions = allInterventions.filter(item => item.riskScore >= 60);
  const mediumPriorityInterventions = allInterventions.filter(item => item.riskScore >= 45 && item.riskScore < 60);
  const lowPriorityInterventions = allInterventions.filter(item => item.riskScore < 45);

  return (
    <div className="interventions-panel">
      <div className="panel-header">
        <h2>Ìª°Ô∏è Preventive Interventions Dashboard</h2>
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-value">{totalInterventions}</div>
            <div className="stat-label">Total Interventions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{departmentAnalysis.length}</div>
            <div className="stat-label">Departments</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{highPriorityInterventions.length}</div>
            <div className="stat-label">High Priority</div>
          </div>
        </div>
      </div>

      <div className="interventions-grid">
        {/* High Priority Section */}
        {highPriorityInterventions.length > 0 && (
          <div className="priority-section critical">
            <h3>Ì¥¥ High Priority Interventions ({highPriorityInterventions.length})</h3>
            <div className="interventions-list">
              {highPriorityInterventions.map((item, index) => (
                <div key={index} className="intervention-card critical">
                  <div className="intervention-header">
                    <span className="dept-badge">{item.department}</span>
                    <span className="risk-badge">{item.highRiskCount} high-risk employees</span>
                  </div>
                  <p className="intervention-text">{item.intervention}</p>
                  <div className="intervention-actions">
                    <button className="btn-assign">Assign Owner</button>
                    <button className="btn-track">Track Progress</button>
                    <span className="priority-tag">HIGH</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medium Priority Section */}
        {mediumPriorityInterventions.length > 0 && (
          <div className="priority-section warning">
            <h3>Ìø° Medium Priority Interventions ({mediumPriorityInterventions.length})</h3>
            <div className="interventions-list">
              {mediumPriorityInterventions.map((item, index) => (
                <div key={index} className="intervention-card warning">
                  <div className="intervention-header">
                    <span className="dept-badge">{item.department}</span>
                    <span className="risk-badge">{item.highRiskCount} high-risk employees</span>
                  </div>
                  <p className="intervention-text">{item.intervention}</p>
                  <div className="intervention-actions">
                    <button className="btn-assign">Assign Owner</button>
                    <button className="btn-schedule">Schedule</button>
                    <span className="priority-tag">MEDIUM</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low Priority Section */}
        {lowPriorityInterventions.length > 0 && (
          <div className="priority-section safe">
            <h3>Ìø¢ Low Priority Interventions ({lowPriorityInterventions.length})</h3>
            <div className="interventions-list">
              {lowPriorityInterventions.map((item, index) => (
                <div key={index} className="intervention-card safe">
                  <div className="intervention-header">
                    <span className="dept-badge">{item.department}</span>
                    <span className="risk-badge">{item.highRiskCount} high-risk employees</span>
                  </div>
                  <p className="intervention-text">{item.intervention}</p>
                  <div className="intervention-actions">
                    <button className="btn-assign">Assign Owner</button>
                    <button className="btn-review">Quarterly Review</button>
                    <span className="priority-tag">LOW</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterventionsPanel;
