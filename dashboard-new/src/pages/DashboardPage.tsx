import React from 'react';
import { Container } from '@mui/material';
import Dashboard from './/DashboardPage';

const DashboardPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Dashboard />
    </Container>
  );
};

export default DashboardPage;