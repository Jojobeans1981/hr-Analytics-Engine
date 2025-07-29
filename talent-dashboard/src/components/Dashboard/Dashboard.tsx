import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Box,
  Container // Added missing import
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Assessment {
  id: number;
  employeeName: string;
  riskScore: number;
  date: string;
  status: string;
}

interface DashboardData {
  employees: number;
  highRisk: number;
  assessments: number;
  teams: number;
  recentAssessments: Assessment[];
  riskDistribution: { name: string; count: number }[];
}

import {
  Grid, // Using stable Grid component
  Card,
  CardContent,
  Typography,
  Container
} from '@mui/material';

interface MetricCardProps {
  title: string;
  value: number | string;
  backgroundColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, backgroundColor = '#fff' }) => (
  <Card sx={{ backgroundColor, height: '100%' }}>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  // Sample data - replace with your actual data fetching
  const metrics = [
    { title: 'Total Employees', value: 42, bgColor: '#e3f2fd' },
    { title: 'High Risk', value: 8, bgColor: '#ffebee' },
    { title: 'Total Assessments', value: 126, bgColor: '#fff3e0' },
    { title: 'Teams', value: 5, bgColor: '#e8f5e9' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Talent Risk Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard 
              title={metric.title} 
              value={metric.value} 
              backgroundColor={metric.bgColor} 
            />
          </Grid>
        ))}
        
        {/* Full-width section example */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {/* Add your table/chart component here */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;