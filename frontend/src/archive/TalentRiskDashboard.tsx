import React, { useState, useEffect, useCallback } from "react";
import "./EmployeeDashboard.css";

// Define API base URL (adjust as needed)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000/api';

// Types
interface Employee {
  id: string;
  name: string;
  department: string;
  riskScore: number;
  lastEvaluation: string;
}

interface TalentRiskDashboardProps {
  // Add props if needed
}

const TalentRiskDashboard: React.FC<TalentRiskDashboardProps> = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- API SERVICE ---
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:10000/api/employees", {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setEmployees(result.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Calculate risk statistics
  const highRiskCount = employees.filter(emp => emp.riskScore >= 7).length;
  const mediumRiskCount = employees.filter(emp => emp.riskScore >= 4 && emp.riskScore < 7).length;
  const lowRiskCount = employees.filter(emp => emp.riskScore < 4).length;

  if (loading) {
    return <div className="loading">Loading talent risk data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="talent-risk-dashboard">
      <h1>Talent Risk Dashboard</h1>
      <div style={{color: "red", fontSize: "20px", padding: "20px", border: "2px solid red", marginBottom: "20px"}}>CSS TEST BOX - Red means CSS is loading</div>
      
      <div className="risk-summary">
        <div className="risk-card high">
          <h3>High Risk</h3>
          <p>{highRiskCount} employees</p>
        </div>
        <div className="risk-card medium">
          <h3>Medium Risk</h3>
          <p>{mediumRiskCount} employees</p>
        </div>
        <div className="risk-card low">
          <h3>Low Risk</h3>
          <p>{lowRiskCount} employees</p>
        </div>
      </div>

      <div className="employees-list">
        <h2>Employees</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Risk Score</th>
              <th>Last Evaluation</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id} className={`risk-${employee.riskScore >= 7 ? 'high' : employee.riskScore >= 4 ? 'medium' : 'low'}`}>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td>{employee.riskScore}/10</td>
                <td>{new Date(employee.lastEvaluation).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TalentRiskDashboard;
