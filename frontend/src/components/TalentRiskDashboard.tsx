import React, { useState, useEffect } from 'react';

const API_BASE_URL = '/api';

const TalentRiskDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/test`);
      const data = await response.json();
      setEmployees(data.data || []);
    } catch (error) {
      console.error('Error:', error);
      // Fallback mock data
      setEmployees([
        { id: 1, name: 'John Doe', department: 'Engineering', riskScore: 75, riskLevel: 'HIGH' },
        { id: 2, name: 'Jane Smith', department: 'Sales', riskScore: 45, riskLevel: 'MEDIUM' },
        { id: 3, name: 'Mike Johnson', department: 'HR', riskScore: 25, riskLevel: 'LOW' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Talent Risk Dashboard</h1>
      <p>Total Employees: {employees.length}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '30px' }}>
        {employees.map(emp => (
          <div key={emp.id} style={{ 
            border: '1px solid #ddd', 
            padding: '20px', 
            borderRadius: '8px',
            backgroundColor: '#fff'
          }}>
            <h3>{emp.name}</h3>
            <p>Department: {emp.department}</p>
            <p>Risk Score: <strong>{emp.riskScore}%</strong></p>
            <p>Risk Level: 
              <span style={{
                marginLeft: '10px',
                padding: '4px 12px',
                borderRadius: '20px',
                backgroundColor: emp.riskScore > 70 ? '#fef2f2' : 
                               emp.riskScore > 40 ? '#fffbeb' : '#f0fdf4',
                color: emp.riskScore > 70 ? '#991b1b' : 
                       emp.riskScore > 40 ? '#92400e' : '#065f46'
              }}>
                {emp.riskScore > 70 ? 'HIGH' : emp.riskScore > 40 ? 'MEDIUM' : 'LOW'}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalentRiskDashboard;
