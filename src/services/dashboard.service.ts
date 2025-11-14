export class DashboardService {
  static async getDashboardData(): Promise<any> {
    return { metrics: [], charts: [] };
  }
}