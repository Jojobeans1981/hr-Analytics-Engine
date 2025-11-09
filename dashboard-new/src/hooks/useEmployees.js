"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEmployees = useEmployees;
const react_1 = require("react");
function useEmployees() {
    const [employees, setEmployees] = (0, react_1.useState)([]);
    const [metrics, setMetrics] = (0, react_1.useState)({
        total: 0,
        active: 0,
        highRisk: 0
    });
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const fetchData = async () => {
            try {
                const [employeesRes, metricsRes] = await Promise.all([
                    fetch('/api/employees'),
                    fetch('/api/employees/metrics')
                ]);
                const checkJSON = async (res) => {
                    const contentType = res.headers.get('content-type');
                    if (!contentType?.includes('application/json')) {
                        const text = await res.text();
                        throw new Error(`Expected JSON, got: ${text.substring(0, 100)}`);
                    }
                    return res.json();
                };
                const [employeesData, metricsData] = await Promise.all([
                    checkJSON(employeesRes),
                    checkJSON(metricsRes)
                ]);
                setEmployees(employeesData);
                setMetrics(metricsData);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    return { employees, metrics, loading, error };
}
