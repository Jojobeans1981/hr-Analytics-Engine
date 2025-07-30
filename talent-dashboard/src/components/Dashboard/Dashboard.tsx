import  Grid  from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';


// interface Assessment {
//   id: number;
//   employeeName: string;
//   riskScore: number;
//   date: string;
//   status: string;
// }

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
    <>
    <Grid maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Talent Risk Dashboard
      </Typography>
      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid component={Card} key={index}>
            <MetricCard
              title={metric.title}
              value={metric.value}
              backgroundColor={metric.bgColor}
            />
          </Grid>
        ))}
        
        <Grid component={Card}>
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
    </Grid>
        </>
  );
};

export default Dashboard;