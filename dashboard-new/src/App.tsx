import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TalentRiskDashboard from './components/TalentRiskDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TalentRiskDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;