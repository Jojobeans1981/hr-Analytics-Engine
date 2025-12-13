export const formatRiskScore = (score) => {
  if (score === undefined || score === null) return 'N/A';
  return `${score}%`;
};

export const getRiskLevelColor = (riskLevel) => {
  switch (riskLevel?.toUpperCase()) {
    case 'HIGH':
      return {
        bg: '#fee',
        text: '#c53030',
        border: '#feb2b2'
      };
    case 'MEDIUM':
      return {
        bg: '#fffbeb',
        text: '#d69e2e',
        border: '#fbd38d'
      };
    case 'LOW':
      return {
        bg: '#f0fff4',
        text: '#38a169',
        border: '#9ae6b4'
      };
    default:
      return {
        bg: '#edf2f7',
        text: '#4a5568',
        border: '#cbd5e0'
      };
  }
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getRiskStatus = (score) => {
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
};

export const calculateDepartmentRisk = (employees) => {
  const deptStats = {};
  
  employees.forEach(emp => {
    if (!deptStats[emp.department]) {
      deptStats[emp.department] = {
        total: 0,
        sum: 0,
        high: 0,
        medium: 0,
        low: 0
      };
    }
    
    deptStats[emp.department].total++;
    deptStats[emp.department].sum += emp.riskScore;
    
    const level = getRiskStatus(emp.riskScore);
    deptStats[emp.department][level.toLowerCase()]++;
  });
  
  return Object.entries(deptStats).map(([dept, stats]) => ({
    department: dept,
    avgRisk: Math.round(stats.sum / stats.total),
    total: stats.total,
    high: stats.high,
    medium: stats.medium,
    low: stats.low
  })).sort((a, b) => b.avgRisk - a.avgRisk);
};
