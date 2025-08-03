class Employee {
  constructor(db) {
    this.collection = db.collection('employees');
  }

  async getHighRisk(threshold = 0.7) {
    return this.collection.find({ riskScore: { $gt: threshold } }).toArray();
  }

  async getDepartments() {
    return this.collection.distinct('department');
  }
}

module.exports = Employee;