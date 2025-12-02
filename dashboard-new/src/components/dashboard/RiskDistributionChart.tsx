// frontend/src/components/RiskDistributionChart.tsx
import React from 'react';

interface RiskDistribution {
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  minimalRisk: number;
}

interface RiskDistributionChartProps {
  distribution: RiskDistribution;
  totalEmployees: number;
}

const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ 
  distribution, 
  totalEmployees 
}) => {
  const riskData = [
    { level: 'HIGH', count: distribution.highRisk, color: 'bg-red-500', textColor: 'text-red-700' },
    { level: 'MEDIUM', count: distribution.mediumRisk, color: 'bg-yellow-500', textColor: 'text-yellow-700' },
    { level: 'LOW', count: distribution.lowRisk, color: 'bg-green-500', textColor: 'text-green-700' },
    { level: 'MINIMAL', count: distribution.minimalRisk, color: 'bg-gray-500', textColor: 'text-gray-700' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
      <div className="space-y-3">
        {riskData.map((risk) => (
          <div key={risk.level} className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${risk.color}`}></div>
            <div className="flex-1">
              <div className="flex justify-between text-sm">
                <span className={risk.textColor}>{risk.level}</span>
                <span>{risk.count} ({(risk.count / totalEmployees * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${risk.color}`}
                  style={{ width: `${(risk.count / totalEmployees) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskDistributionChart;