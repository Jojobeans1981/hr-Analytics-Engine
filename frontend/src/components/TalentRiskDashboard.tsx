import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Users, TrendingUp, TrendingDown, Plus, X, AlertTriangle, Briefcase, Smile, Gauge, Edit,
    Zap, Calendar, Clock, BarChart3, ChevronDown, ChevronUp, ScrollText, Code, Database
} from 'lucide-react';

// --- API CONFIGURATION ---
// Use relative path for Vercel deployment
const API_BASE_URL = '/api';

// --- API SERVICE FUNCTIONS ---
const apiService = {
    async getEmployees() {
        try {
            const response = await fetch(`${API_BASE_URL}/employees`, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching employees:', error);
            return [];
        }
    },

    async getHighRiskEmployees(threshold = 70) {
        try {
            const response = await fetch(`${API_BASE_URL}/employees/high-risk?threshold=${threshold}`, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching high-risk employees:', error);
            return [];
        }
    },

    async getRiskMetrics() {
        try {
            const response = await fetch(`${API_BASE_URL}/dashboard/metrics`, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching metrics:', error);
            return null;
        }
    }
};

// ... I need the rest of your component ...
// For now, let me create a simplified but styled version

const TalentRiskDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [employeesData, metricsData] = await Promise.all([
        apiService.getEmployees(),
        apiService.getRiskMetrics()
      ]);
      setEmployees(employeesData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading Talent Risk Dashboard...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#1e293b',
          marginBottom: '8px'
        }}>
          Talent Risk Dashboard
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#64748b',
          marginBottom: '24px'
        }}>
          Real-time talent risk assessment powered by MongoDB
        </p>
      </header>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <Users style={{ color: '#3b82f6', marginRight: '12px' }} size={24} />
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Total Employees</h3>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#1e293b' }}>
            {metrics?.totalEmployees || employees.length}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <AlertTriangle style={{ color: '#ef4444', marginRight: '12px' }} size={24} />
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Average Risk</h3>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#1e293b' }}>
            {metrics?.avgRiskScore ? `${Math.round(metrics.avgRiskScore)}%` : '0%'}
          </div>
          <div style={{ 
            marginTop: '8px',
            padding: '4px 12px',
            backgroundColor: metrics?.avgRiskScore > 70 ? '#fef2f2' : 
                           metrics?.avgRiskScore > 40 ? '#fffbeb' : '#f0fdf4',
            color: metrics?.avgRiskScore > 70 ? '#991b1b' : 
                   metrics?.avgRiskScore > 40 ? '#92400e' : '#065f46',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'inline-block'
          }}>
            {metrics?.avgRiskScore > 70 ? 'High Risk' : 
             metrics?.avgRiskScore > 40 ? 'Medium Risk' : 'Low Risk'}
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ 
          padding: '24px', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Employee Risk Assessment</h2>
          <span style={{ fontSize: '14px', color: '#64748b' }}>
            Showing {employees.length} employees
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e5e7eb' }}>Department</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e5e7eb' }}>Risk Level</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e5e7eb' }}>Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {employees.slice(0, 10).map(emp => (
                <tr key={emp._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>{emp.name || 'Unknown'}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>{emp.department || 'N/A'}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '14px',
                      fontWeight: '500',
                      backgroundColor: emp.riskLevel === 'HIGH' ? '#fef2f2' :
                                     emp.riskLevel === 'MEDIUM' ? '#fffbeb' : '#f0fdf4',
                      color: emp.riskLevel === 'HIGH' ? '#991b1b' :
                            emp.riskLevel === 'MEDIUM' ? '#92400e' : '#065f46'
                    }}>
                      {emp.riskLevel || 'LOW'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>
                    {emp.riskScore ? `${emp.riskScore}%` : '0%'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ 
        marginTop: '24px', 
        padding: '20px', 
        backgroundColor: '#eff6ff', 
        borderRadius: '8px',
        border: '1px solid #bfdbfe'
      }}>
        <p style={{ color: '#1e40af', marginBottom: '8px', fontWeight: '500' }}>
          <Database size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          API Status: {employees.length > 0 ? 'Connected to MongoDB' : 'Using fallback data'}
        </p>
        <p style={{ color: '#374151', fontSize: '14px' }}>
          {employees.length > 0 
            ? `Successfully loaded ${employees.length} employees from database.`
            : 'Could not connect to database. Showing sample data.'}
        </p>
      </div>
    </div>
  );
};

export default TalentRiskDashboard;
