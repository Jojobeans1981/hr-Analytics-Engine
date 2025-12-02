// src/components/dashboard/RiskDashboard.tsx
import React from 'react';

interface RiskDashboardProps {
  employees: any[];
  departments: Record<string, any>;
  distribution: {
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    minimalRisk: number;
  };
  totalEmployees: number;
}

const RiskDashboard: React.FC<RiskDashboardProps> = ({
  employees,
  departments,
  distribution,
  totalEmployees
}) => {
  // Filter high and critical risk employees
  const criticalRiskEmployees = employees.filter(
    emp => emp.riskLevel === 'CRITICAL' || emp.riskLevel === 'HIGH'
  );

  // Calculate percentages for distribution
  const getPercentage = (count: number) => {
    return totalEmployees > 0 ? ((count / totalEmployees) * 100).toFixed(1) : '0';
  };

  // Get risk level color
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-orange-100 text-orange-800';
      case 'LOW': return 'bg-yellow-100 text-yellow-800';
      case 'MINIMAL': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get risk score color
  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'bg-red-100 text-red-800';
    if (score >= 0.5) return 'bg-orange-100 text-orange-800';
    if (score >= 0.3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Talent Risk Dashboard
        </h1>
        <p className="text-gray-600">
          Enhanced risk assessment using advanced scoring algorithms
        </p>
      </div>
      
      {/* High Risk Employees Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <span className="text-red-500 text-2xl mr-2">🚨</span>
          <h2 className="text-xl font-semibold text-red-700">
            Critical & High Risk Employees
          </h2>
          <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
            {criticalRiskEmployees.length} employees
          </span>
        </div>

        {criticalRiskEmployees.length > 0 ? (
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
                    Enhanced Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Factors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {criticalRiskEmployees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.role}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(employee.enhancedRiskScore || employee.riskScore)}`}>
                        {((employee.enhancedRiskScore || employee.riskScore) * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(employee.riskLevel)}`}>
                        {employee.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs">
                        {employee.riskFactors?.slice(0, 3).map((factor: string, index: number) => (
                          <div key={index} className="text-xs bg-gray-100 rounded px-2 py-1 mb-1">
                            {factor}
                          </div>
                        ))}
                        {employee.riskFactors?.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{employee.riskFactors.length - 3} more factors
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.confidenceScore || 'N/A'}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No critical or high-risk employees found. Great job! 🎉
          </p>
        )}
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Department Risk Levels */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department Risk Levels
          </h3>
          <div className="space-y-3">
            {Object.entries(departments).map(([deptName, deptData]) => (
              <div key={deptName} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{deptName}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {deptData.highRisk} high risk
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    deptData.avgRiskScore >= 0.7 ? 'bg-red-100 text-red-800' :
                    deptData.avgRiskScore >= 0.5 ? 'bg-orange-100 text-orange-800' :
                    deptData.avgRiskScore >= 0.3 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {(deptData.avgRiskScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Risk Distribution
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-red-700">CRITICAL & HIGH</span>
              <span className="text-sm text-gray-600">
                {distribution.highRisk} ({getPercentage(distribution.highRisk)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-orange-700">MEDIUM</span>
              <span className="text-sm text-gray-600">
                {distribution.mediumRisk} ({getPercentage(distribution.mediumRisk)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-yellow-700">LOW</span>
              <span className="text-sm text-gray-600">
                {distribution.lowRisk} ({getPercentage(distribution.lowRisk)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-700">MINIMAL</span>
              <span className="text-sm text-gray-600">
                {distribution.minimalRisk} ({getPercentage(distribution.minimalRisk)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Risk Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Risk Assessment Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalEmployees}</div>
            <div className="text-sm text-gray-600">Total Employees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{distribution.highRisk}</div>
            <div className="text-sm text-gray-600">High/Critical Risk</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{distribution.mediumRisk}</div>
            <div className="text-sm text-gray-600">Medium Risk</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {distribution.lowRisk + distribution.minimalRisk}
            </div>
            <div className="text-sm text-gray-600">Low/Minimal Risk</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskDashboard;