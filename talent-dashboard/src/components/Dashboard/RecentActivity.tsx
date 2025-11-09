import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  Chip
} from '@mui/material';

interface Activity {
  _id: string;
  assessmentDate: string;
  riskScore: number;
  status: string;
  employee?: {
    name: string;
  };
}

interface RecentActivityProps {
  activities: Activity[];
}

const getRiskColor = (score: number) => {
  if (score > 7) return 'error';
  if (score > 4) return 'warning';
  return 'success';
};

const RecentActivity = ({ activities }: RecentActivityProps) => {
  if (!activities || activities.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary">
        No recent activities found
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Risk</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity._id}>
              <TableCell>{activity.employee?.name || 'Unknown'}</TableCell>
              <TableCell>
                {new Date(activity.assessmentDate).toLocaleDateString()}
              </TableCell>
              <TableCell align="right">
                <Chip 
                  label={activity.riskScore.toFixed(1)} 
                  color={getRiskColor(activity.riskScore)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip 
                  label={activity.status} 
                  color={activity.status === 'completed' ? 'success' : 'warning'}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentActivity;