"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDashboardData = void 0;
const fetchDashboardData = async () => {
    try {
        const response = await fetch('/api/dashboard/metrics');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
    catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        throw error;
    }
};
exports.fetchDashboardData = fetchDashboardData;
