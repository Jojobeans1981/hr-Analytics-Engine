import { Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

interface MetricCardProps {
  title: string;
  value: number;
  trend?: 'up' | 'down' | 'neutral';
}
 const MetricCard = ({ title, value, trend }: MetricCardProps) => {
  const trendIcon = {
    up: <TrendingUpIcon color="success" />,
    down: <TrendingDownIcon color="error" />,
    neutral: <HorizontalRuleIcon color="disabled" />
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h4">{value}</Typography>
          {trend && trendIcon[trend]}
        </Box>
      </CardContent>
    </Card>
  );
};
export default MetricCard;