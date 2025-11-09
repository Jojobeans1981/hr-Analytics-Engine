"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboardData = void 0;
const react_1 = require("react");
const dashboardService_1 = require("../services/dashboardService"); // Update import path
const useDashboardData = () => {
    const [data, setData] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const loadData = async () => {
            try {
                const dashboardData = await (0, dashboardService_1.fetchDashboardData)();
                setData(dashboardData);
            }
            catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load data'));
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    return { data, loading, error };
};
exports.useDashboardData = useDashboardData;
