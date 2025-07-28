import React, { useEffect, useState } from 'react';

import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { assessmentService, employeeService, Employee, AssessmentStats } from '../../services/api';

const COLORS = {
  high: '#ff4444',
  medium: '#ff9800',
  low: '#4caf50'
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<AssessmentStats | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, employeesRes] = await Promise.all([
        assessmentService.getStats(),
        employeeService.getAll()
      ]);
      
      setStats(statsRes.data.data);
      setEmployees(employeesRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getRiskIcon = (score: number) => {
    if (score >= 7) return <span style={{ color: COLORS.high }}>⚠️</span>;
    if (score >= 4) return <span style={{ color: COLORS.medium }}>📈</span>;
    return <span style={{ color: COLORS.low }}>✅</span>;
  };

  const getRiskColor = (score: number) => {
    if (score >= 7) return COLORS.high;
    if (score >= 4) return COLORS.medium;
    return COLORS.low;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const pieData = [
    { name: 'High Risk', value: stats?.riskDistribution?.high || 0 },
    { name: 'Medium Risk', value: stats?.riskDistribution?.medium || 0 },
    { name: 'Low Risk', value: stats?.riskDistribution?.low || 0 },
  ];

  const highRiskEmployees = employees
    .filter(emp => emp.riskScore >= 7)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  // Calculate department averages
  const departmentData = employees.reduce((acc: any[], emp) => {
    const existing = acc.find(d => d.department === emp.department);
    if (existing) {
      existing.totalRisk += emp.riskScore;
      existing.count += 1;
      existing.avgRisk = existing.totalRisk / existing.count;
    } else {
      acc.push({
        department: emp.department,
        totalRisk: emp.riskScore,
        count: 1,
        avgRisk: emp.riskScore
      });
    }
    return acc;
  }, []).map(d => ({
    department: d.department,
    avgRisk: parseFloat(d.avgRisk.toFixed(1)),
    employees: d.count
  }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Talent Risk Dashboard
      </Typography>
      
      {/* Summary Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, 
        gap: 3,
        mb: 3
      }}>
        <Box>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Employees
              </Typography>
              <Typography variant="h3">
                {employees.length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        <Box>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Risk Score
              </Typography>
              <Typography variant="h3">
                {stats?.averageRiskScore || '0'}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card sx={{ bgcolor: '#ffebee' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                High Risk
              </Typography>
              <Typography variant="h3" sx={{ color: COLORS.high }}>
                {stats?.riskDistribution?.high || 0}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Assessments
              </Typography>
              <Typography variant="h3">
                {stats?.totalAssessments || 0}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Charts */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
        gap: 3,
        mb: 3
      }}>
        {/* Risk Distribution Chart */}
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Risk Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={Object.values(COLORS)[index]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* High Risk Employees */}
        <Box>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Employees Requiring Attention
            </Typography>
            <Box sx={{ mt: 2 }}>
              {highRiskEmployees.map((emp) => (
                <Box
                  key={emp.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    mb: 1,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    '&:hover': { bgcolor: '#eeeeee' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: getRiskColor(emp.riskScore) }}>
                      {emp.firstName[0]}{emp.lastName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {emp.firstName} {emp.lastName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {emp.position} • {emp.department}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getRiskIcon(emp.riskScore)}
                    <Typography
                      variant="h6"
                      sx={{ color: getRiskColor(emp.riskScore), fontWeight: 'bold' }}
                    >
                      {emp.riskScore.toFixed(1)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Department Risk Overview */}
      <Box>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Department Risk Overview
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgRisk" fill="#8884d8" name="Average Risk Score" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
