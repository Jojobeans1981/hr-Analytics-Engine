import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RiskFactorChartProps {
  data?: {
    labels: string[];
    values: number[];
  };
}

 const RiskFactorChart = ({ data }: RiskFactorChartProps) => {
  if (!data || data.labels.length === 0) {
    return (
      <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2, height: 300 }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  const chartData = data.labels.map((label, index) => ({
    name: label,
    risk: data.values[index]
  }));

  return (
    <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2, height: 300 }}>
      <Typography variant="h6" gutterBottom>
        Risk Factor Distribution
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Bar 
            dataKey="risk" 
            fill="#8884d8" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
export default RiskFactorChart;