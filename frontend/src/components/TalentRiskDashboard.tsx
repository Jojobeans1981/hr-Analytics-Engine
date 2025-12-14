import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Users, TrendingUp, TrendingDown, Plus, X, AlertTriangle, Briefcase, Smile, Gauge, Edit,
    Zap, Calendar, Clock, BarChart3, ChevronDown, ChevronUp, ScrollText, Code, Database
} from 'lucide-react';

// --- API CONFIGURATION ---
// Use Vercel serverless functions at /api
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
            return {
                totalEmployees: 0,
                avgRiskScore: 0,
                highRiskEmployees: 0,
                riskDistribution: { high: 0, medium: 0, low: 0 }
            };
        }
    },

    async createEmployee(employeeData: any) {
        try {
            const response = await fetch(`${API_BASE_URL}/employees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData),
            });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error creating employee:', error);
            throw error;
        }
    },

    async updateEmployee(employeeId: string, employeeData: any) {
        try {
            const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData),
            });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error updating employee:', error);
            throw error;
        }
    },

    async deleteEmployee(employeeId: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw error;
        }
    }
};

// --- RISK CALCULATION UTILITIES ---
const calculateRiskScore = (performance: number, engagement: number, tenure: number, assessmentScore: number) => {        
    let score = 0;
    score += (5 - performance) * 7.5;
    score += (5 - engagement) * 7.5;

    if (tenure < 1) {
        score += 20;
    } else if (tenure >= 1 && tenure <= 3) {
        score += 10;
    }

    score += (100 - assessmentScore) * 0.2;
    return Math.min(Math.max(Math.round(score), 0), 100);
};

const getRiskLevel = (score: number) => {
    if (score > 60) return 'High';
    if (score > 30) return 'Medium';
    return 'Low';
};

const getRiskColor = (level: string) => {
    switch (level) {
        case 'High': return 'bg-red-500/20 text-red-400 border-red-500';
        case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
        case 'Low': return 'bg-teal-500/20 text-teal-400 border-teal-500';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
};

const getSuggestions = (employee: any) => {
    const suggestions = [];

    if (employee.performance <= 2) {
        suggestions.push("Structured coaching: Implement a 90-day performance improvement plan.");
    }

    if (employee.engagement <= 2) {
        suggestions.push("Stay Interview: Schedule a dedicated discussion to understand challenges and aspirations.");    
    }

    if (employee.assessmentScore < 70) {
        suggestions.push(`Targeted Training: Enroll in programs to improve competencies (${employee.assessmentScore}%).`);
    }

    if (employee.tenure < 1) {
        suggestions.push("Onboarding Review: Re-evaluate onboarding and assign senior mentor.");
    }

    if (employee.riskScore > 80) {
        suggestions.push("Leadership Review: Flag for urgent review by departmental leadership.");
    }

    if (suggestions.length === 0) {
        suggestions.push("Maintain current development plan and check in quarterly.");
    }

    return suggestions;
};

// Main dashboard component
const TalentRiskDashboard = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'mock'>('mock');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await apiService.getEmployees();
      setEmployees(data);
      setConnectionStatus(data.length > 0 ? 'connected' : 'mock');
    } catch (error) {
      console.error('Error loading data:', error);
      // Use mock data
      setEmployees([
        {
          id: '1',
          name: 'John Doe',
          role: 'Senior Developer',
          department: 'Engineering',
          tenure: 36,
          performance: 4.2,
          engagement: 78,
          assessmentScore: 85,
          riskScore: 65,
          riskLevel: 'HIGH',
          skills: ['React', 'Node.js', 'TypeScript']
        },
        {
          id: '2',
          name: 'Jane Smith',
          role: 'Account Executive',
          department: 'Sales',
          tenure: 12,
          performance: 2.8,
          engagement: 60,
          assessmentScore: 65,
          riskScore: 45,
          riskLevel: 'MEDIUM',
          skills: ['Sales', 'Negotiation', 'CRM']
        }
      ]);
      setConnectionStatus('mock');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading Talent Risk Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Talent Risk Dashboard</h1>
            <p className="text-gray-400 mt-2">
              {connectionStatus === 'connected' 
                ? 'Connected to MongoDB Atlas' 
                : 'Using sample data - Add MONGODB_URI to Vercel environment variables'}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg ${connectionStatus === 'connected' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
            {connectionStatus === 'connected' ? 'LIVE' : 'DEMO MODE'}
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Users className="text-blue-400 mr-3" size={24} />
            <h3 className="text-gray-400">Total Employees</h3>
          </div>
          <div className="text-3xl font-bold">{employees.data.length}</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-red-400 mr-3" size={24} />
            <h3 className="text-gray-400">High Risk</h3>
          </div>
          <div className="text-3xl font-bold text-red-400">
            {employees.data.filter(e => e.riskLevel === 'HIGH').length}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Gauge className="text-yellow-400 mr-3" size={24} />
            <h3 className="text-gray-400">Avg Risk Score</h3>
          </div>
          <div className="text-3xl font-bold">
            {Math.round(employees.data.reduce((sum, emp) => sum + (emp.riskScore || 0), 0) / employees.data.length || 0)}%
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="text-green-400 mr-3" size={24} />
            <h3 className="text-gray-400">Avg Engagement</h3>
          </div>
          <div className="text-3xl font-bold text-green-400">
            {Math.round(employees.data.reduce((sum, emp) => sum + (emp.engagement || 0), 0) / employees.data.length || 0)}%
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Employee Risk Assessment</h2>
          <p className="text-gray-400 text-sm mt-1">
            Showing {employees.data.length} employees • Click any row for details
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="text-left p-4 text-gray-400 font-medium">Employee</th>
                <th className="text-left p-4 text-gray-400 font-medium">Role & Department</th>
                <th className="text-left p-4 text-gray-400 font-medium">Tenure</th>
                <th className="text-left p-4 text-gray-400 font-medium">Risk Level</th>
                <th className="text-left p-4 text-gray-400 font-medium">Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {employees.data.map(emp => (
                <tr key={emp.id} className="border-b border-gray-700 hover:bg-gray-750 cursor-pointer">
                  <td className="p-4">
                    <div className="font-medium">{emp.name}</div>
                    <div className="text-sm text-gray-400">{emp.email || 'N/A'}</div>
                  </td>
                  <td className="p-4">
                    <div>{emp.role}</div>
                    <div className="text-sm text-gray-400">{emp.department}</div>
                  </td>
                  <td className="p-4">{emp.tenure} months</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(emp.riskLevel)}`}>
                      {emp.riskLevel}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-700 rounded-full h-2 mr-3">
                        <div 
                          className={`h-full rounded-full ${emp.riskScore > 70 ? 'bg-red-500' : emp.riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${emp.riskScore}%` }}
                        />
                      </div>
                      <span className="font-medium">{emp.riskScore}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connection Status Banner */}
      <div className={`mt-6 p-4 rounded-lg ${connectionStatus === 'connected' ? 'bg-green-900/20 border border-green-800' : 'bg-yellow-900/20 border border-yellow-800'}`}>
        <div className="flex items-center">
          <Database size={20} className={connectionStatus === 'connected' ? 'text-green-400 mr-3' : 'text-yellow-400 mr-3'} />
          <div>
            <p className="font-medium">
              {connectionStatus === 'connected' ? '✅ Connected to MongoDB' : '⚠️ Using Sample Data'}
            </p>
            <p className="text-sm opacity-80 mt-1">
              {connectionStatus === 'connected' 
                ? `Successfully loaded ${employees.data.length} employees from your database.`
                : 'To connect to your MongoDB database, add MONGODB_URI to Vercel environment variables.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentRiskDashboard;
