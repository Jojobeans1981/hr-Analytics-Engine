const Employee = require('../models/Employee');

class EmployeeService {
  constructor(db) {
    this.employee = new Employee(db);
  }

  async getRiskAnalysis() {
    const [highRisk, departments] = await Promise.all([
      this.employee.getHighRisk(),
      this.employee.getDepartments()
    ]);
    
    return {
      highRiskCount: highRisk.length,
      departments,
      latestAssessment: new Date().toISOString()
    };
  }
}

module.exports = EmployeeService;