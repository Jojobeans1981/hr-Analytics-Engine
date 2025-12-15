import React, { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { formatRiskScore, getRiskLevelColor, formatDate, calculateDepartmentRisk } from '../utils/formatters';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [filters, setFilters] = useState({
    department: '',
    riskLevel: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  
  const {
    employees,
    loading,
    error,
    stats,
    setParams,
    refresh
  } = useEmployees(filters);
  
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setParams(newFilters);
  };
  
  const departmentStats = calculateDepartmentRisk(employees);
  
  if (loading && !employees.length) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading employee data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="dashboard-error">
        <h3>Error Loading Data</h3>
        <p>{error}</p>
        <button onClick={refresh}>Retry</button>
      </div>
    );
  }
  
  return (
    <div className="talent-risk-dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Talent Risk Dashboard</h1>
          <p className="subtitle">Monitor and manage employee risk across your organization</p>
        </div>
        
        <div className="header-actions">
          <button className="btn-refresh" onClick={refresh}>
            <span className="icon">‚Üª</span> Refresh
          </button>
          <button className="btn-export">
            <span className="icon">Ì≥ä</span> Export
          </button>
        </div>
      </header>
      
      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card total">
          <div className="stat-icon">Ì±•</div>
          <div className="stat-content">
            <h3>Total Employees</h3>
            <div className="stat-value">{stats?.data?.totalEmployees || employees.length}</div>
          </div>
        </div>
        
        <div className="stat-card high-risk">
          <div className="stat-icon">‚ö†Ô∏è</div>
          <div className="stat-content">
            <h3>High Risk</h3>
            <div className="stat-value">{stats?.data?.riskLevels?.high || 0}</div>
            <div className="stat-percentage">
              {Math.round((stats?.data?.riskLevels?.high / employees.length) * 100) || 0}%
            </div>
          </div>
        </div>
        
        <div className="stat-card medium-risk">
          <div className="stat-icon">ÔøΩÔøΩ</div>
          <div className="stat-content">
            <h3>Medium Risk</h3>
            <div className="stat-value">{stats?.data?.riskLevels?.medium || 0}</div>
            <div className="stat-percentage">
              {Math.round((stats?.data?.riskLevels?.medium / employees.length) * 100) || 0}%
            </div>
          </div>
        </div>
        
        <div className="stat-card low-risk">
          <div className="stat-icon">‚úÖ</div>
          <div className="stat-content">
            <h3>Low Risk</h3>
            <div className="stat-value">{stats?.data?.riskLevels?.low || 0}</div>
            <div className="stat-percentage">
              {Math.round((stats?.data?.riskLevels?.low / employees.length) * 100) || 0}%
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="dashboard-filters">
        <div className="filter-group">
          <label>Department</label>
          <select 
            value={filters.department} 
            onChange={(e) => handleFilterChange('department', e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Risk Level</label>
          <select 
            value={filters.riskLevel} 
            onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Sort By</label>
          <select 
            value={filters.sortBy} 
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="name">Name</option>
            <option value="riskScore">Risk Score</option>
            <option value="department">Department</option>
            <option value="hireDate">Hire Date</option>
          </select>
        </div>
        
        <div className="view-toggle">
          <button 
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </button>
          <button 
            className={viewMode === 'table' ? 'active' : ''}
            onClick={() => setViewMode('table')}
          >
            Table View
          </button>
        </div>
      </div>
      
      {/* Department Overview */}
      {departmentStats.length > 0 && (
        <div className="department-overview">
          <h2>Department Risk Overview</h2>
          <div className="department-grid">
            {departmentStats.map(dept => (
              <div key={dept.department} className="department-card">
                <h3>{dept.department}</h3>
                <div className="dept-stats">
                  <div className="dept-stat">
                    <span className="label">Avg Risk:</span>
                    <span className={`value risk-${dept.avgRisk >= 70 ? 'high' : dept.avgRisk >= 40 ? 'medium' : 'low'}`}>
                      {dept.avgRisk}%
                    </span>
                  </div>
                  <div className="dept-stat">
                    <span className="label">Total:</span>
                    <span className="value">{dept.total}</span>
                  </div>
                  <div className="dept-risk-breakdown">
                    <span className="risk-dot high">{dept.high}H</span>
                    <span className="risk-dot medium">{dept.medium}M</span>
                    <span className="risk-dot low">{dept.low}L</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Employees Grid/Table */}
      <div className="employees-section">
        <div className="section-header">
          <h2>Employees ({employees.length})</h2>
          <div className="summary">
            Showing {employees.length} employees
          </div>
        </div>
        
        {viewMode === 'grid' ? (
          <div className="employees-grid">
            {employees.map(employee => {
              const riskColors = getRiskLevelColor(employee.riskLevel);
              return (
                <div 
                  key={employee._id} 
                  className="employee-card"
                  style={{
                    borderLeft: `4px solid ${riskColors.border}`,
                    backgroundColor: riskColors.bg + '20'
                  }}
                >
                  <div className="employee-header">
                    <h3>{employee.name}</h3>
                    <span 
                      className="risk-badge"
                      style={{
                        backgroundColor: riskColors.bg,
                        color: riskColors.text,
                        borderColor: riskColors.border
                      }}
                    >
                      {employee.riskLevel}
                    </span>
                  </div>
                  
                  <div className="employee-body">
                    <div className="employee-info">
                      <div className="info-row">
                        <span className="label">Department:</span>
                        <span className="value">{employee.department}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Position:</span>
                        <span className="value">{employee.position}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Risk Score:</span>
                        <span 
                          className="value risk-score"
                          style={{ color: riskColors.text }}
                        >
                          {formatRiskScore(employee.riskScore)}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">Email:</span>
                        <span className="value">{employee.email}</span>
                      </div>
                      {employee.hireDate && (
                        <div className="info-row">
                          <span className="label">Hire Date:</span>
                          <span className="value">{formatDate(employee.hireDate)}</span>
                        </div>
                      )}
                    </div>
                    
                    {employee.performanceScore && (
                      <div className="performance-meter">
                        <div className="meter-label">Performance</div>
                        <div className="meter-bar">
                          <div 
                            className="meter-fill"
                            style={{ width: `${employee.performanceScore}%` }}
                          ></div>
                          <span className="meter-text">{employee.performanceScore}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="employees-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Risk Score</th>
                  <th>Risk Level</th>
                  <th>Performance</th>
                  <th>Hire Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => {
                  const riskColors = getRiskLevelColor(employee.riskLevel);
                  return (
                    <tr key={employee._id}>
                      <td>
                        <div className="employee-name">
                          <strong>{employee.name}</strong>
                          <div className="email">{employee.email}</div>
                        </div>
                      </td>
                      <td>{employee.department}</td>
                      <td>{employee.position}</td>
                      <td>
                        <span 
                          className="risk-score-display"
                          style={{ color: riskColors.text }}
                        >
                          {formatRiskScore(employee.riskScore)}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="risk-level-badge"
                          style={{
                            backgroundColor: riskColors.bg,
                            color: riskColors.text
                          }}
                        >
                          {employee.riskLevel}
                        </span>
                      </td>
                      <td>
                        {employee.performanceScore ? (
                          <div className="performance-cell">
                            <div className="performance-bar">
                              <div 
                                className="bar-fill"
                                style={{ width: `${employee.performanceScore}%` }}
                              ></div>
                            </div>
                            <span className="performance-value">{employee.performanceScore}%</span>
                          </div>
                        ) : 'N/A'}
                      </td>
                      <td>{formatDate(employee.hireDate)}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-view">View</button>
                          <button className="btn-edit">Edit</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Loading indicator for refreshes */}
      {loading && employees.length > 0 && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Updating data...</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
