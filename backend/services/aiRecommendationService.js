// AI Recommendation Service - CommonJS Version
// Original logic only, no external APIs

/**
 * Generate AI recommendations for an employee
 * ORIGINAL FUNCTIONALITY: Returns structured recommendations
 */
async function generateAIRecommendations(employeeData) {
  console.log(
    'Generating recommendations for:',
    employeeData.name || 'Employee',
  );

  // Base recommendations
  const recommendations = [
    {
      title: 'Manager Check-in Meeting',
      type: 'retention',
      action: 'Schedule bi-weekly 1:1 meetings with direct manager',
      timeline: 'Within 1 week',
      expectedImpact: 'Improve communication and address concerns early',
    },
    {
      title: 'Skills Development Plan',
      type: 'development',
      action: 'Create personalized learning path for career growth',
      timeline: 'Within 2 weeks',
      expectedImpact: 'Increase engagement and reduce flight risk',
    },
  ];

  // Department-specific logic
  if (employeeData.department === 'Engineering') {
    recommendations.push({
      title: 'Technical Mentorship',
      type: 'mentorship',
      action: 'Pair with senior engineer for code review sessions',
      timeline: 'Within 2 weeks',
      expectedImpact: 'Improve technical skills and team integration',
    });
  }

  // Risk-level adjustment
  if (employeeData.riskLevel === 'High') {
    recommendations[0].timeline = 'Within 48 hours';
  }

  // Performance-based addition
  if (employeeData.performanceScore && employeeData.performanceScore < 3.0) {
    recommendations.push({
      title: 'Performance Improvement Plan',
      type: 'development',
      action: 'Develop clear performance metrics and review schedule',
      timeline: 'Within 1 week',
      expectedImpact: 'Address performance gaps with structured support',
    });
  }

  console.log(`Generated ${recommendations.length} recommendations`);
  return recommendations;
}

/**
 * Fallback function - for backward compatibility
 */
function generateFallbackRecommendations(employeeData) {
  return generateAIRecommendations(employeeData);
}

// CommonJS exports
module.exports = {
  generateAIRecommendations,
  generateFallbackRecommendations,
};
