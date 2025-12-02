import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import MetricCard from './MetricCard';
import RecentActivity from './RecentActivity';
import RiskFactorChart from './RiskFactorChart';

interface RiskDashboardProps {
  employees: any[];
  departments: Record<string, any>;
  distribution: any;
  totalEmployees: number;
}

const RiskDashboard: React.FC<RiskDashboardProps> = ({
  employees,
  departments,
  distribution,
  totalEmployees
}) => {
  // Calculate metrics
  const highRiskCount = distribution?.highRisk || 0;
  const avgRiskScore = employees.length > 0 
    ? employees.reduce((sum: number, emp: any) => sum + (emp.riskScore || 0), 0) / employees.length 
    : 0;
  const departmentsAtRisk = Object.keys(departments || {}).filter(
    (dept: string) => (departments[dept]?.highRisk || 0) > 0
  ).length;

  // Calculate avg risk score as a number (percentage)
  const avgRiskPercentage = avgRiskScore * 100;

  // Process data for RiskFactorChart
  const getRiskFactorData = () => {
    const factorCount: Record<string, number> = {};
    
    employees.forEach(employee => {
      if (employee.riskFactors && Array.isArray(employee.riskFactors)) {
        employee.riskFactors.forEach((factor: string) => {
          factorCount[factor] = (factorCount[factor] || 0) + 1;
        });
      }
    });

    // Get top 5 risk factors
    const sortedFactors = Object.entries(factorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      labels: sortedFactors.map(([factor]) => factor),
      values: sortedFactors.map(([, count]) => count)
    };
  };

  const riskFactorData = getRiskFactorData();

  return (
    <Box className="p-6">
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
        AI Talent Risk Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Employees"
            value={totalEmployees}
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="High Risk Employees"
            value={highRiskCount}
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Avg Risk Score"
            value={parseFloat(avgRiskPercentage.toFixed(1))}
            trend="down"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Departments at Risk"
            value={departmentsAtRisk}
            trend="up"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Risk Factors Distribution
            </Typography>
            <RiskFactorChart data={riskFactorData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <RecentActivity activities={[]} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RiskDashboard;
