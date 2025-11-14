export class DashboardService {
interface DashboardData {
  metrics: any[]; // Replace 'any[]' with specific metric type
  charts: any[];  // Replace 'any[]' with specific chart type
}

export class DashboardService {
  static async getDashboardData(): Promise<DashboardData> {
    return { metrics: [], charts: [] };
  }
}    return { metrics: [], charts: [] };
  }
}