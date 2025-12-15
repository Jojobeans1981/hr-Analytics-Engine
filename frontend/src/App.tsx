import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnhancedTalentRiskDashboard from './components/EnhancedTalentRiskDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EnhancedTalentRiskDashboard />} />
      </Routes>
    </Router>
  );
}

export default App; // Force redeploy Sat, Dec 13, 2025  1:15:10 PM
// another test
// final test
