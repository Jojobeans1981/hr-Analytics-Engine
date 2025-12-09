import React from 'react';

function SimpleDashboard({ employees = [] }) {
  const stats = {
    total: employees.length,
    highRisk: employees.filter(e => e.riskLevel === 'high').length,
    mediumRisk: employees.filter(e => e.riskLevel === 'medium').length,
    lowRisk: employees.filter(e => e.riskLevel === 'low').length
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Employee Risk Dashboard
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.total}</div>
          <div style={{ color: '#666' }}>Total Employees</div>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>{stats.highRisk}</div>
          <div style={{ color: '#666' }}>High Risk</div>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>{stats.mediumRisk}</div>
          <div style={{ color: '#666' }}>Medium Risk</div>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669' }}>{stats.lowRisk}</div>
          <div style={{ color: '#666' }}>Low Risk</div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Name</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Department</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Risk Level</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Risk Score</th>
            </tr>
          </thead>
          <tbody>
            {employees.slice(0, 10).map(emp => (
              <tr key={emp._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px' }}>{emp.name}</td>
                <td style={{ padding: '12px 16px' }}>{emp.department}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: emp.riskLevel === 'high' ? '#fee2e2' : 
                                   emp.riskLevel === 'medium' ? '#fef3c7' : '#d1fae5',
                    color: emp.riskLevel === 'high' ? '#991b1b' : 
                          emp.riskLevel === 'medium' ? '#92400e' : '#065f46'
                  }}>
                    {emp.riskLevel.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>{emp.riskScore}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
        <h3 style={{ fontWeight: '600', color: '#1e40af', marginBottom: '10px' }}>Dashboard Status</h3>
        <p style={{ color: '#374151', marginBottom: '15px' }}>
          This is a simplified dashboard showing {employees.length} employees.
          Connect to backend API to see real data.
        </p>
        <button
          onClick={() => window.location.href = '/registry-test'}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Registry Test Page
        </button>
      </div>
    </div>
  );
}

export default SimpleDashboard;
