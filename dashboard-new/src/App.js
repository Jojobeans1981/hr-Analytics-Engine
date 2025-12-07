import React from 'react';
import SimpleDashboard from './components/simple/SimpleDashboard';

function App() {
  // Mock data for testing
  const mockEmployees = [
    { _id: '1', name: 'Employee 1', department: 'Engineering', riskScore: 75, riskLevel: 'high' },
    { _id: '2', name: 'Employee 2', department: 'Sales', riskScore: 45, riskLevel: 'medium' },
    { _id: '3', name: 'Employee 3', department: 'HR', riskScore: 20, riskLevel: 'low' },
    { _id: '4', name: 'Employee 4', department: 'Finance', riskScore: 80, riskLevel: 'high' },
    { _id: '5', name: 'Employee 5', department: 'Marketing', riskScore: 35, riskLevel: 'medium' }
  ];

  return (
    <div className="App">
      <SimpleDashboard employees={mockEmployees} />
    </div>
  );
}

export default App;
