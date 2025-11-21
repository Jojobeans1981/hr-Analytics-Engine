"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
class DashboardService {
    static async getDashboardData() {
        return { metrics: [], charts: [] };
    }
}
exports.DashboardService = DashboardService;
