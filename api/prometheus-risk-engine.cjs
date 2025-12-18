const { MongoClient } = require('mongodb');

const CONFIG = {
  MONGODB_URI: 'mongodb+srv://beamers051681:allthewayhome@prometheus.inv2hx4.mongodb.net/talent-risk?retryWrites=true&w=majority',
  DB_NAME: 'talent-risk'
};

class PrometheusRiskEngine {
  calculateRiskScore(employee) {
    let totalScore = 0;
    
    // 1. PERFORMANCE RISK (30%)
    const perfRisk = this.calculatePerformanceRisk(employee);
    totalScore += perfRisk * 0.30;
    
    // 2. ENGAGEMENT RISK (25%)
    const engageRisk = this.calculateEngagementRisk(employee);
    totalScore += engageRisk * 0.25;
    
    // 3. TENURE & GROWTH RISK (20%)
    const tenureRisk = this.calculateTenureRisk(employee);
    totalScore += tenureRisk * 0.20;
    
    // 4. MARKET RISK (15%)
    const marketRisk = this.calculateMarketRisk(employee);
    totalScore += marketRisk * 0.15;
    
    // 5. SKILL RISK (10%)
    const skillRisk = this.calculateSkillRisk(employee);
    totalScore += skillRisk * 0.10;
    
    return Math.min(100, Math.max(0, Math.round(totalScore)));
  }
  
  calculatePerformanceRisk(emp) {
    let risk = 0;
    if (emp.performanceRating < 2.0) risk = 90;
    else if (emp.performanceRating < 3.0) risk = 60;
    else if (emp.performanceRating < 3.8) risk = 30;
    else risk = 10;
    return Math.min(100, risk);
  }
  
  calculateEngagementRisk(emp) {
    let risk = 0;
    if (emp.engagementScore < 40) risk = 85;
    else if (emp.engagementScore < 60) risk = 55;
    else if (emp.engagementScore < 75) risk = 30;
    else risk = 15;
    return risk;
  }
  
  calculateTenureRisk(emp) {
    const tenure = emp.tenureMonths || 12;
    let risk = 0;
    if (tenure < 6) risk = 70;
    else if (tenure < 18) risk = 40;
    else if (tenure < 36) risk = 20;
    else risk = 10;
    return Math.min(100, risk);
  }
  
  calculateMarketRisk(emp) {
    const highDemandSkills = ['AI', 'Machine Learning', 'Cybersecurity', 'Cloud', 'Data Science', 'DevOps'];
    const empSkills = emp.criticalSkills || [];
    let marketRisk = 30;
    const matches = empSkills.filter(skill => 
      highDemandSkills.some(demandSkill => 
        skill.toLowerCase().includes(demandSkill.toLowerCase())
      )
    ).length;
    marketRisk += matches * 15;
    return Math.min(100, marketRisk);
  }
  
  calculateSkillRisk(emp) {
    const legacySkills = ['COBOL', 'VB6', 'Flash', 'Silverlight', 'Perl'];
    const empSkills = emp.criticalSkills || [];
    let skillRisk = 20;
    const matches = empSkills.filter(skill => 
      legacySkills.some(legacySkill => 
        skill.toLowerCase().includes(legacySkill.toLowerCase())
      )
    ).length;
    skillRisk += matches * 10;
    return Math.min(100, skillRisk);
  }
  
  getRiskLevel(score) {
    if (score >= 75) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 45) return 'ELEVATED';
    if (score >= 30) return 'MODERATE';
    return 'LOW';
  }
}

async function updateRiskScores() {
  let client;
  try {
    console.log('Ì¥ß UPDATING WITH PROMETHEUS RISK ENGINE...');
    client = await MongoClient.connect(CONFIG.MONGODB_URI);
    const db = client.db(CONFIG.DB_NAME);
    
    const engine = new PrometheusRiskEngine();
    const employees = await db.collection('employees').find({}).toArray();
    console.log(`Found ${employees.length} employees to update`);
    
    let updates = 0;
    for (const emp of employees) {
      const newRiskScore = engine.calculateRiskScore(emp);
      const newRiskLevel = engine.getRiskLevel(newRiskScore);
      
      if (emp.riskScore !== newRiskScore) {
        await db.collection('employees').updateOne(
          { _id: emp._id },
          { 
            $set: { 
              riskScore: newRiskScore,
              riskLevel: newRiskLevel,
              updatedAt: new Date()
            }
          }
        );
        updates++;
      }
    }
    
    console.log(`‚úÖ Updated ${updates} employees`);
    
    // Show new distribution
    const updatedEmployees = await db.collection('employees').find({}).toArray();
    const distribution = {
      CRITICAL: updatedEmployees.filter(e => e.riskLevel === 'CRITICAL').length,
      HIGH: updatedEmployees.filter(e => e.riskLevel === 'HIGH').length,
      ELEVATED: updatedEmployees.filter(e => e.riskLevel === 'ELEVATED').length,
      MODERATE: updatedEmployees.filter(e => e.riskLevel === 'MODERATE').length,
      LOW: updatedEmployees.filter(e => e.riskLevel === 'LOW').length
    };
    
    console.log('\nÌ≥ä NEW RISK DISTRIBUTION:');
    Object.entries(distribution).forEach(([level, count]) => {
      console.log(`   ${level}: ${count} employees`);
    });
    
  } catch (error) {
    console.error('‚ùå Error:', error.message);
  } finally {
    if (client) await client.close();
  }
}

updateRiskScores();
