import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnhancedTalentRiskDashboard from './components/EnhancedTalentRiskDashboard';
import InterventionsPage from './components/InterventionsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EnhancedTalentRiskDashboard />} />
        <Route path="/interventions" element={<InterventionsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
