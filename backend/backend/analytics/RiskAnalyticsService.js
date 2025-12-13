class RiskAnalyticsService {
  constructor() {
    this.historicalData = new Map();
  }
  
  /**
   * Analyze risk patterns across organization
   * @param {Array} riskResults - Risk calculation results
   * @returns {Object} Analytics insights
   */
  analyzeOrganizationRisk(riskResults) {
    if (!riskResults || riskResults.length === 0) {
      return { message: 'No data available for analysis' };
    }
    
    const analytics = {
      summary: this.calculateSummary(riskResults),
      departments: this.analyzeByDepartment(riskResults),
      riskDistribution: this.calculateRiskDistribution(riskResults),
      trends: this.analyzeTrends(riskResults),
      hotspots: this.identifyHotspots(riskResults),
      recommendations: []
    };
    
    // Generate recommendations
    analytics.recommendations = this.generateRecommendations(analytics);
    
    return analytics;
  }
  
  calculateSummary(riskResults) {
    const validResults = riskResults.filter(r => r.score !== null && r.score !== undefined);
    
    if (validResults.length === 0) return {};
    
    const scores = validResults.map(r => r.score);
    const highRisk = validResults.filter(r => r.riskLevel === 'HIGH');
    const mediumRisk = validResults.filter(r => r.riskLevel === 'MEDIUM');
    const lowRisk = validResults.filter(r => r.riskLevel === 'LOW');
    
    return {
      totalEmployees: riskResults.length,
      analyzedEmployees: validResults.length,
      averageRiskScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      medianRiskScore: this.calculateMedian(scores),
      highRiskCount: highRisk.length,
      mediumRiskCount: mediumRisk.length,
      lowRiskCount: lowRisk.length,
      highRiskPercentage: Math.round((highRisk.length / validResults.length) * 100),
      overallRiskLevel: this.calculateOverallRiskLevel(scores)
    };
  }
  
  analyzeByDepartment(riskResults) {
    const departmentMap = new Map();
    
    riskResults.forEach(result => {
      if (!result.department || result.score === undefined) return;
      
      if (!departmentMap.has(result.department)) {
        departmentMap.set(result.department, {
          scores: [],
          employees: [],
          riskLevels: { HIGH: 0, MEDIUM: 0, LOW: 0 }
        });
      }
      
      const deptData = departmentMap.get(result.department);
      deptData.scores.push(result.score);
      deptData.employees.push({
        id: result.employeeId,
        name: result.employeeName,
        score: result.score,
        riskLevel: result.riskLevel
      });
      deptData.riskLevels[result.riskLevel]++;
    });
    
    const departmentAnalysis = {};
    
    for (const [dept, data] of departmentMap) {
      const scores = data.scores;
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      departmentAnalysis[dept] = {
        employeeCount: scores.length,
        averageRiskScore: Math.round(avgScore),
        highRiskCount: data.riskLevels.HIGH,
        mediumRiskCount: data.riskLevels.MEDIUM,
        lowRiskCount: data.riskLevels.LOW,
        highRiskPercentage: Math.round((data.riskLevels.HIGH / scores.length) * 100),
        highestRiskEmployee: this.findHighestRiskEmployee(data.employees),
        riskLevel: this.calculateOverallRiskLevel(scores)
      };
    }
    
    return departmentAnalysis;
  }
  
  calculateRiskDistribution(riskResults) {
    const distribution = {
      byScoreRange: {
        '0-19': 0,
        '20-39': 0,
        '40-59': 0,
        '60-79': 0,
        '80-100': 0
      },
      byRiskLevel: {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0
      }
    };
    
    riskResults.forEach(result => {
      if (result.score === undefined) return;
      
      // Score range distribution
      if (result.score <= 19) distribution.byScoreRange['0-19']++;
      else if (result.score <= 39) distribution.byScoreRange['20-39']++;
      else if (result.score <= 59) distribution.byScoreRange['40-59']++;
      else if (result.score <= 79) distribution.byScoreRange['60-79']++;
      else distribution.byScoreRange['80-100']++;
      
      // Risk level distribution
      if (result.riskLevel) {
        distribution.byRiskLevel[result.riskLevel]++;
      }
    });
    
    return distribution;
  }
  
  analyzeTrends(riskResults) {
    // This would typically compare with historical data
    // For now, provide basic trend analysis
    
    const trends = {
      highRiskTrend: 'stable',
      overallTrend: 'stable',
      departmentTrends: {}
    };
    
    // If we have historical data in results
    const resultsWithTrends = riskResults.filter(r => r.trend);
    
    if (resultsWithTrends.length > 0) {
      const increasing = resultsWithTrends.filter(r => 
        r.trend.direction && r.trend.direction.includes('increasing')
      ).length;
      
      const decreasing = resultsWithTrends.filter(r => 
        r.trend.direction && r.trend.direction.includes('decreasing')
      ).length;
      
      if (increasing > decreasing * 1.5) {
        trends.overallTrend = 'increasing';
      } else if (decreasing > increasing * 1.5) {
        trends.overallTrend = 'decreasing';
      }
    }
    
    return trends;
  }
  
  identifyHotspots(riskResults) {
    const hotspots = {
      criticalEmployees: [],
      highRiskDepartments: [],
      concerningPatterns: []
    };
    
    // Identify critical employees (score > 80)
    hotspots.criticalEmployees = riskResults
      .filter(r => r.score > 80)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(r => ({
        id: r.employeeId,
        name: r.employeeName,
        department: r.department,
        score: r.score,
        riskLevel: r.riskLevel,
        factors: r.factors ? Object.entries(r.factors).filter(([_, v]) => v > 70).map(([k]) => k) : []
      }));
    
    // Identify departments with high average risk
    const departmentScores = {};
    
    riskResults.forEach(result => {
      if (!result.department || result.score === undefined) return;
      
      if (!departmentScores[result.department]) {
        departmentScores[result.department] = { total: 0, count: 0 };
      }
      
      departmentScores[result.department].total += result.score;
      departmentScores[result.department].count++;
    });
    
    const departmentAverages = Object.entries(departmentScores)
      .map(([dept, data]) => ({
        department: dept,
        averageScore: data.total / data.count,
        employeeCount: data.count
      }))
      .filter(dept => dept.averageScore > 60 && dept.employeeCount >= 3)
      .sort((a, b) => b.averageScore - a.averageScore);
    
    hotspots.highRiskDepartments = departmentAverages;
    
    // Identify concerning patterns
    const patterns = [];
    
    // Pattern: Multiple high-risk employees in same team
    const managerMap = new Map();
    riskResults.forEach(result => {
      if (result.score > 70) {
        const manager = result.managerId || 'unknown';
        if (!managerMap.has(manager)) {
          managerMap.set(manager, []);
        }
        managerMap.get(manager).push(result);
      }
    });
    
    for (const [manager, employees] of managerMap) {
      if (employees.length >= 3) {
        patterns.push({
          type: 'manager_team_risk',
          manager: manager,
          count: employees.length,
          averageScore: Math.round(employees.reduce((sum, e) => sum + e.score, 0) / employees.length),
          employees: employees.map(e => ({ name: e.employeeName, score: e.score }))
        });
      }
    }
    
    // Pattern: Similar risk factors across department
    const factorPatterns = this.identifyFactorPatterns(riskResults);
    hotspots.concerningPatterns = [...patterns, ...factorPatterns];
    
    return hotspots;
  }
  
  identifyFactorPatterns(riskResults) {
    const patterns = [];
    const factorCounts = {};
    
    // Count high-risk factors across organization
    riskResults.forEach(result => {
      if (result.factors) {
        Object.entries(result.factors).forEach(([factor, score]) => {
          if (score > 70) {
            if (!factorCounts[factor]) factorCounts[factor] = 0;
            factorCounts[factor]++;
          }
        });
      }
    });
    
    // Identify common factors
    Object.entries(factorCounts).forEach(([factor, count]) => {
      if (count >= 5) { // At least 5 employees share this high-risk factor
        patterns.push({
          type: 'common_risk_factor',
          factor: factor,
          affectedEmployees: count,
          percentage: Math.round((count / riskResults.length) * 100)
        });
      }
    });
    
    return patterns;
  }
  
  generateRecommendations(analytics) {
    const recommendations = [];
    
    // High overall risk recommendation
    if (analytics.summary.highRiskPercentage > 20) {
      recommendations.push({
        priority: 'high',
        category: 'organization',
        title: 'Address High Organizational Risk',
        description: `${analytics.summary.highRiskPercentage}% of employees are at high risk. Consider organization-wide retention initiatives.`,
        actions: [
          'Conduct stay interviews',
          'Review compensation strategy',
          'Enhance career development programs'
        ]
      });
    }
    
    // Department-specific recommendations
    Object.entries(analytics.departments).forEach(([dept, data]) => {
      if (data.highRiskPercentage > 30) {
        recommendations.push({
          priority: 'medium',
          category: 'department',
          department: dept,
          title: `High Risk Concentration in ${dept}`,
          description: `${data.highRiskPercentage}% of ${dept} employees are at high risk.`,
          actions: [
            `Conduct ${dept}-specific risk assessment`,
            'Review department leadership and culture',
            'Address department-specific pain points'
          ]
        });
      }
    });
    
    // Critical employees recommendation
    if (analytics.hotspots.criticalEmployees.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'individual',
        title: 'Immediate Attention Required',
        description: `${analytics.hotspots.criticalEmployees.length} employees are at critical risk level (>80).`,
        actions: [
          'Schedule one-on-one meetings immediately',
          'Develop personalized retention plans',
          'Escalate to senior leadership'
        ]
      });
    }
    
    // Factor pattern recommendations
    analytics.hotspots.concerningPatterns.forEach(pattern => {
      if (pattern.type === 'common_risk_factor') {
        recommendations.push({
          priority: 'medium',
          category: 'factor',
          title: `Address Common Risk Factor: ${pattern.factor}`,
          description: `${pattern.affectedEmployees} employees share high risk in ${pattern.factor}.`,
          actions: [
            `Investigate root causes for ${pattern.factor}`,
            'Develop targeted interventions',
            'Monitor improvement over next quarter'
          ]
        });
      }
    });
    
    return recommendations;
  }
  
  // Utility methods
  calculateMedian(scores) {
    if (scores.length === 0) return 0;
    
    const sorted = [...scores].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
    }
    
    return Math.round(sorted[middle]);
  }
  
  calculateOverallRiskLevel(scores) {
    if (scores.length === 0) return 'LOW';
    
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (average >= 70) return 'HIGH';
    if (average >= 40) return 'MEDIUM';
    return 'LOW';
  }
  
  findHighestRiskEmployee(employees) {
    if (employees.length === 0) return null;
    
    return employees.reduce((highest, current) => 
      current.score > highest.score ? current : highest
    );
  }
  
  /**
   * Generate risk report
   * @param {Array} riskResults - Risk calculation results
   * @param {Object} options - Report options
   * @returns {Object} Comprehensive risk report
   */
  generateRiskReport(riskResults, options = {}) {
    const analytics = this.analyzeOrganizationRisk(riskResults);
    
    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        employeeCount: riskResults.length,
        reportId: `RISK-${Date.now()}`,
        options
      },
      executiveSummary: {
        overallRiskLevel: analytics.summary.overallRiskLevel,
        keyFindings: [
          `${analytics.summary.highRiskCount} high-risk employees identified`,
          `${Object.keys(analytics.departments).length} departments analyzed`,
          `${analytics.recommendations.length} recommendations generated`
        ],
        topConcerns: analytics.hotspots.criticalEmployees.slice(0, 3).map(e => e.name)
      },
      detailedAnalysis: analytics,
      visualizations: {
        // Data structure for charts (can be consumed by frontend chart libraries)
        riskDistribution: this.prepareChartData(analytics.riskDistribution),
        departmentComparison: this.prepareDepartmentChartData(analytics.departments),
        trendData: this.prepareTrendData(analytics.trends)
      },
      actionPlan: {
        immediateActions: analytics.recommendations.filter(r => r.priority === 'high'),
        mediumTermActions: analytics.recommendations.filter(r => r.priority === 'medium'),
        timeline: this.generateTimeline(analytics.recommendations)
      },
      appendix: {
        methodology: 'Risk scores calculated using weighted algorithms considering tenure, performance, market factors, and engagement.',
        dataSources: 'Employee data, performance reviews, market intelligence, engagement surveys',
        limitations: 'Analysis based on available data. Actual attrition risk may vary based on unmeasured factors.'
      }
    };
    
    return report;
  }
  
  prepareChartData(distribution) {
    return {
      byScoreRange: Object.entries(distribution.byScoreRange).map(([range, count]) => ({
        range,
        count
      })),
      byRiskLevel: Object.entries(distribution.byRiskLevel).map(([level, count]) => ({
        level,
        count
      }))
    };
  }
  
  prepareDepartmentChartData(departments) {
    return Object.entries(departments).map(([dept, data]) => ({
      department: dept,
      averageScore: data.averageRiskScore,
      employeeCount: data.employeeCount,
      highRiskPercentage: data.highRiskPercentage
    }));
  }
  
  prepareTrendData(trends) {
    // Mock trend data - in production, would use historical data
    return {
      overallTrend: trends.overallTrend,
      dataPoints: [
        { month: 'Jan', score: 45 },
        { month: 'Feb', score: 48 },
        { month: 'Mar', score: 52 },
        { month: 'Apr', score: 55 },
        { month: 'May', score: 58 },
        { month: 'Jun', score: 62 }
      ]
    };
  }
  
  generateTimeline(recommendations) {
    const timeline = [];
    const today = new Date();
    
    recommendations.forEach((rec, index) => {
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + (rec.priority === 'high' ? 7 : 30));
      
      timeline.push({
        action: rec.title,
        priority: rec.priority,
        dueDate: dueDate.toISOString().split('T')[0],
        responsible: rec.category === 'organization' ? 'HR Leadership' : 'Department Head',
        status: 'pending'
      });
    });
    
    return timeline;
  }
}

// Create singleton instance
const riskAnalyticsService = new RiskAnalyticsService();

module.exports = riskAnalyticsService;
