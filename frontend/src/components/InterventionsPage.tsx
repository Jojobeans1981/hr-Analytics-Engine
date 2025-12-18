import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeDashboard.css';

const InterventionsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data - in real app, this would come from API
  const departmentAnalysis = [
    {
      name: 'Engineering',
      employeeCount: 45,
      avgRiskScore: 68,
      highRiskCount: 12,
      mediumRiskCount: 18,
      lowRiskCount: 15,
      topRiskFactors: ['High market demand', 'Skill gaps', 'Burnout risk'],
      suggestedInterventions: [
        'Retention bonuses for top performers',
        'Structured skill development program',
        'Quarterly workload assessment',
        'Mentorship program implementation'
      ]
    },
    {
      name: 'Sales',
      employeeCount: 32,
      avgRiskScore: 72,
      highRiskCount: 15,
      mediumRiskCount: 10,
      lowRiskCount: 7,
      topRiskFactors: ['High turnover', 'Commission structure issues', 'Market competition'],
      suggestedInterventions: [
        'Commission structure review',
        'Sales training refresh',
        'Competitive analysis',
        'Team building workshops'
      ]
    },
    {
      name: 'Marketing',
      employeeCount: 28,
      avgRiskScore: 55,
      highRiskCount: 8,
      mediumRiskCount: 12,
      lowRiskCount: 8,
      topRiskFactors: ['Budget constraints', 'Tool proficiency gaps', 'Campaign performance'],
      suggestedInterventions: [
        'Marketing tool training',
        'Budget optimization workshop',
        'Performance metrics review'
      ]
    },
    {
      name: 'HR',
      employeeCount: 18,
      avgRiskScore: 42,
      highRiskCount: 3,
      mediumRiskCount: 7,
      lowRiskCount: 8,
      topRiskFactors: ['Policy compliance', 'Employee satisfaction', 'Recruitment challenges'],
      suggestedInterventions: [
        'Policy compliance audit',
        'Employee satisfaction survey',
        'Recruitment process optimization'
      ]
    }
  ];
  
  const totalInterventions = departmentAnalysis.reduce((sum, dept) => sum + dept.suggestedInterventions.length, 0);
  
  const allInterventions = departmentAnalysis.flatMap(dept => 
    dept.suggestedInterventions.map(intervention => ({
      department: dept.name,
      intervention,
      riskScore: dept.avgRiskScore,
      highRiskCount: dept.highRiskCount,
      employeeCount: dept.employeeCount
    }))
  );

  const criticalPriority = allInterventions.filter(item => item.riskScore >= 70);
  const highPriority = allInterventions.filter(item => item.riskScore >= 60 && item.riskScore < 70);
  const mediumPriority = allInterventions.filter(item => item.riskScore >= 45 && item.riskScore < 60);
  const lowPriority = allInterventions.filter(item => item.riskScore < 45);

  return (
    <div className="interventions-page">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="back-button">
          ‚Üê Back to Dashboard
        </button>
        <h1>Ìª°Ô∏è Preventive Interventions</h1>
        <div className="page-stats">
          <div className="stat">
            <div className="stat-number">{totalInterventions}</div>
            <div className="stat-label">Total Interventions</div>
          </div>
          <div className="stat">
            <div className="stat-number">{departmentAnalysis.length}</div>
            <div className="stat-label">Departments</div>
          </div>
          <div className="stat">
            <div className="stat-number">{criticalPriority.length + highPriority.length}</div>
            <div className="stat-label">High Priority</div>
          </div>
          <div className="stat">
            <div className="stat-number">{departmentAnalysis.reduce((sum, dept) => sum + dept.employeeCount, 0)}</div>
            <div className="stat-label">Total Employees</div>
          </div>
        </div>
      </div>

      <div className="interventions-container">
        {/* Critical Priority */}
        {criticalPriority.length > 0 && (
          <section className="priority-section critical">
            <h2>Ì¥¥ Critical Priority ({criticalPriority.length})</h2>
            <div className="interventions-grid">
              {criticalPriority.map((item, index) => (
                <div key={index} className="intervention-card critical">
                  <div className="card-header">
                    <span className="department">{item.department}</span>
                    <span className="risk-count">{item.highRiskCount} high-risk / {item.employeeCount} total</span>
                  </div>
                  <p className="intervention">{item.intervention}</p>
                  <div className="card-actions">
                    <button className="btn primary">Assign Owner</button>
                    <button className="btn secondary">Set Deadline</button>
                    <span className="badge critical">URGENT</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* High Priority */}
        {highPriority.length > 0 && (
          <section className="priority-section high">
            <h2>Ìø† High Priority ({highPriority.length})</h2>
            <div className="interventions-grid">
              {highPriority.map((item, index) => (
                <div key={index} className="intervention-card high">
                  <div className="card-header">
                    <span className="department">{item.department}</span>
                    <span className="risk-count">{item.highRiskCount} high-risk employees</span>
                  </div>
                  <p className="intervention">{item.intervention}</p>
                  <div className="card-actions">
                    <button className="btn primary">Assign Owner</button>
                    <button className="btn secondary">30-Day Plan</button>
                    <span className="badge high">HIGH</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Medium Priority */}
        {mediumPriority.length > 0 && (
          <section className="priority-section medium">
            <h2>Ìø° Medium Priority ({mediumPriority.length})</h2>
            <div className="interventions-grid">
              {mediumPriority.map((item, index) => (
                <div key={index} className="intervention-card medium">
                  <div className="card-header">
                    <span className="department">{item.department}</span>
                    <span className="risk-count">{item.highRiskCount} high-risk employees</span>
                  </div>
                  <p className="intervention">{item.intervention}</p>
                  <div className="card-actions">
                    <button className="btn primary">Assign Owner</button>
                    <button className="btn secondary">Quarterly Review</button>
                    <span className="badge medium">MEDIUM</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Low Priority */}
        {lowPriority.length > 0 && (
          <section className="priority-section low">
            <h2>Ìø¢ Low Priority ({lowPriority.length})</h2>
            <div className="interventions-grid">
              {lowPriority.map((item, index) => (
                <div key={index} className="intervention-card low">
                  <div className="card-header">
                    <span className="department">{item.department}</span>
                    <span className="risk-count">{item.highRiskCount} high-risk employees</span>
                  </div>
                  <p className="intervention">{item.intervention}</p>
                  <div className="card-actions">
                    <button className="btn primary">Assign Owner</button>
                    <button className="btn secondary">Monitor</button>
                    <span className="badge low">LOW</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default InterventionsPage;
