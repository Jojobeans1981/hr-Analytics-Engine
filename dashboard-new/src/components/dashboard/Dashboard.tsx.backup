import React, { useState, useEffect } from 'react';
import RiskDashboard from './RiskDashboard';
import DepartmentRiskChart from './DepartmentRiskChart';
import RiskDistributionChart from './RiskDistributionChart';
import { Employee, DepartmentStats, RiskDistribution, DepartmentData } from '../../types/risk';
import { getEmployees } from '../../api/dashboard.api';
//Local fallback AdvancedRiskScorer (used when ../../utils/advancedRiskScorer is not present)
class AdvancedRiskScorer {
  async updateAllEmployeeRiskScores(employees: Employee[]): Promise<Employee[]> {
    // Simple deterministic enhancement: combine existing riskScore with performance/engagement heuristics
    return employees.map(emp => {
      const base = emp.riskScore ?? 0;
      const perfFactor = emp.performanceScore != null ? Math.max(0, (5 - emp.performanceScore) / 5) : 0;
      const engagementFactor = emp.engagementScore != null ? (1 - emp.engagementScore / 100) : 0;
      const enhanced = Math.min(1, Math.max(0, base * 0.6 + perfFactor * 0.2 + engagementFactor * 0.2));
      return { ...emp, enhancedRiskScore: enhanced };
    });
  }
}

// Mock data that matches your MongoDB structure
// const mockEmployees: Employee[] = [
//   {
//     _id: '1',
//     employeeId: 'EMP001',
//     name: 'John Doe',
//     department: 'Engineering',
//     role: 'Senior Developer',
//     tenure: 36,
//     performanceScore: 4.2,
//     engagementScore: 78,
//     lastPromotion: '2023-06-15',
//     email: 'john.doe@company.com',
//     riskScore: 0.65,
//     riskLevel: 'HIGH',
//     riskFactors: ['High performer - market demand', 'Limited technical skill diversity']
//   },
//   {
//     _id: '2',
//     employeeId: 'EMP002', 
//     name: 'Jane Smith',
//     department: 'Sales',
//     role: 'Account Executive',
//     tenure: 12,
//     performanceScore: 2.8,
//     engagementScore: 60,
//     lastPromotion: '2023-12-01',
//     email: 'jane.smith@company.com',
//     riskScore: 0.45,
//     riskLevel: 'MEDIUM',
//     riskFactors: ['Low performance score', 'Short tenure (<2 years)']
//   },
//   {
//     _id: '3',
//     employeeId: 'EMP003',
//     name: 'Mike Johnson',
//     department: 'Engineering', 
//     role: 'Frontend Developer',
//     tenure: 24,
//     performanceScore: 3.8,
//     engagementScore: 85,
//     lastPromotion: '2022-08-20',
//     email: 'mike.johnson@company.com',
//     riskScore: 0.25,
//     riskLevel: 'LOW',
//     riskFactors: ['No promotion in 18+ months']
//   },
//   {
//     _id: '4',
//     employeeId: 'EMP004',
//     name: 'Sarah Wilson',
//     department: 'Marketing',
//     role: 'Marketing Manager',
//     tenure: 48,
//     performanceScore: 4.8,
//     engagementScore: 92,
//     lastPromotion: '2024-01-10',
//     email: 'sarah.wilson@company.com',
//     riskScore: 0.15,
//     riskLevel: 'MINIMAL',
//     riskFactors: ['High performer - market demand']
//   }
// ];

const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Record<string, DepartmentStats>>({});
  const [departmentChartData, setDepartmentChartData] = useState<DepartmentData>({});
  const [distribution, setDistribution] = useState<RiskDistribution>({ 
    highRisk: 0, 
    mediumRisk: 0, 
    lowRisk: 0, 
    minimalRisk: 0 
  });
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processRiskData = async () => {
      try {
        setLoading(true);
        
        // Initialize the risk scorer
        const riskScorer = new AdvancedRiskScorer();
        
        // Process each employee with enhanced risk scoring
        const apiEmployees = await getEmployees();
        console.log('API Response:', apiEmployees); 
        setEmployees(apiEmployees);
        setTotalEmployees(apiEmployees.length);

        // Calculate department statistics
        const deptStats: Record<string, DepartmentStats> = {};
        const chartData: DepartmentData = {};

        apiEmployees.forEach((emp: Employee) => {
          if (!deptStats[emp.department]) {
            deptStats[emp.department] = {
              total: 0,
              highRisk: 0,
              totalRisk: 0,
              avgRiskScore: 0,
              employees: []
            };
          }
          
          deptStats[emp.department].total++;
          // Use enhancedRiskScore if available, fall back to riskScore
          const riskScore = emp.enhancedRiskScore ?? emp.riskScore ?? 0;
          deptStats[emp.department].totalRisk += riskScore;
          
          if (emp.riskLevel === 'HIGH' || emp.riskLevel === 'CRITICAL') {
            deptStats[emp.department].highRisk++;
          }
          
          deptStats[emp.department].employees.push(emp);
        });

        // Calculate average risk per department and prepare chart data
        Object.keys(deptStats).forEach((dept: string) => {
          const deptData = deptStats[dept];
          deptData.avgRiskScore = deptData.total > 0 
            ? (deptData.totalRisk / deptData.total) 
            : 0;

          // Transform data for DepartmentRiskChart
          chartData[dept] = {
            total: deptData.total,
            highRisk: deptData.highRisk,
            avgRisk: `${(deptData.avgRiskScore * 100).toFixed(1)}%`
          };
        });

        setDepartments(deptStats);
        setDepartmentChartData(chartData);

        // Calculate risk distribution
        const dist: RiskDistribution = {
          highRisk:apiEmployees.filter((emp: Employee) => 
            emp.riskLevel === 'CRITICAL' || emp.riskLevel === 'HIGH'
          ).length,
          mediumRisk: apiEmployees.filter((emp: Employee) => 
            emp.riskLevel === 'MEDIUM'
          ).length,
          lowRisk: apiEmployees.filter((emp: Employee) => 
            emp.riskLevel === 'LOW'
          ).length,
          minimalRisk: apiEmployees.filter((emp: Employee) => 
            emp.riskLevel === 'MINIMAL'
          ).length
        };

        setDistribution(dist);

      } catch (error) {
        console.error('Error in risk data processing:', error);
      } finally {
        setLoading(false);
      }
    };

    processRiskData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">🔄 Calculating advanced risk scores...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <RiskDashboard 
        employees={employees}
        departments={departments}
        distribution={distribution}
        totalEmployees={totalEmployees}
      />
  
      {/* Charts with enhanced risk data */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentRiskChart 
          departments={departmentChartData}
        />
        <RiskDistributionChart 
          distribution={distribution} 
          totalEmployees={totalEmployees} 
        />
      </div>
    </div>
  );
};

export default Dashboard;