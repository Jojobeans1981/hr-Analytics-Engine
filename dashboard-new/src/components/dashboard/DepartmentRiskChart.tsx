// frontend/src/components/DepartmentRiskChart.tsx
import React from 'react';

interface DepartmentData {
  [key: string]: {
    total: number;
    highRisk: number;
    avgRisk: string;
  };
}

interface DepartmentRiskChartProps {
  departments: DepartmentData;
}

const DepartmentRiskChart: React.FC<DepartmentRiskChartProps> = ({ departments }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Department Risk Levels</h3>
      <div className="space-y-3">
        {Object.entries(departments).map(([dept, data]) => {
          const highRiskPercentage = (data.highRisk / data.total) * 100;
          return (
            <div key={dept} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{dept}</span>
                <span>{highRiskPercentage.toFixed(1)}% high risk</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${highRiskPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{data.highRisk} high risk of {data.total} total</span>
                <span>Avg score: {data.avgRisk}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentRiskChart;