'use client';

import { useEffect, useState } from 'react';

interface Employee {
  _id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  riskScore: number;
  riskLevel: string;
  performanceRating: number;
  tenureMonths: number;
  location: string;
}

interface Stats {
  total: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}

export default function RegistryTestPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try to fetch from API
      const response = await fetch('/api/employees');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setEmployees(data.data || []);
        setStats(data.stats || { total: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0 });
      } else {
        throw new Error(data.error || 'Failed to fetch employee data');
      }
      
    } catch (err) {
      console.error('Error fetching employee data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      
      // Fallback: Create mock data for testing
      const mockEmployees: Employee[] = [];
      for (let i = 1; i <= 10; i++) {
        mockEmployees.push({
          _id: `mock-${i}`,
          name: `Test Employee ${i}`,
          email: `employee${i}@test.com`,
          department: i % 2 === 0 ? 'Engineering' : 'Sales',
          role: i % 3 === 0 ? 'Senior' : i % 3 === 1 ? 'Mid' : 'Junior',
          riskScore: i * 10,
          riskLevel: i > 7 ? 'high' : i > 4 ? 'medium' : 'low',
          performanceRating: 3.5,
          tenureMonths: i * 6,
          location: i % 2 === 0 ? 'New York' : 'Remote'
        });
      }
      
      setEmployees(mockEmployees);
      setStats({
        total: mockEmployees.length,
        highRisk: mockEmployees.filter(e => e.riskLevel === 'high').length,
        mediumRisk: mockEmployees.filter(e => e.riskLevel === 'medium').length,
        lowRisk: mockEmployees.filter(e => e.riskLevel === 'low').length
      });
      
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Employee Registry</h2>
          <p className="text-gray-500 mt-2">Fetching employee data from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employee Risk Registry</h1>
          <p className="text-gray-600 mt-2">
            View and manage employee risk assessments. Showing {employees.length} employees.
          </p>
          
          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-700">
                <span className="font-semibold">Note:</span> {error} Displaying sample data.
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-gray-500">Total Employees</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-red-600">{stats.highRisk}</div>
            <div className="text-gray-500">High Risk</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">{stats.mediumRisk}</div>
            <div className="text-gray-500">Medium Risk</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{stats.lowRisk}</div>
            <div className="text-gray-500">Low Risk</div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Employee List</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenure
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{employee.department}</div>
                      <div className="text-sm text-gray-500">{employee.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(employee.riskLevel)}`}>
                        {employee.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className={`h-2 rounded-full ${
                              employee.riskLevel === 'high' ? 'bg-red-500' :
                              employee.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(100, employee.riskScore)}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{employee.riskScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{employee.performanceRating?.toFixed(1) || 'N/A'}/5.0</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {employee.tenureMonths} months
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {employees.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">í³Š</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                The employee registry is empty. Seed the database or check your API connection.
              </p>
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Debug Information</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>â€¢ Total employees loaded: {employees.length}</p>
            <p>â€¢ API Status: {error ? 'Error - using mock data' : 'Connected'}</p>
            <p>â€¢ First employee: {employees[0]?.name || 'None'}</p>
            <button
              onClick={fetchEmployeeData}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
