import { useState, useEffect } from 'react';

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  status: string;
}

interface Metrics {
  total: number;
  active: number;
  highRisk: number;
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    total: 0,
    active: 0,
    highRisk: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, metricsRes] = await Promise.all([
          fetch('http://localhost:5000/api/employees'),
          fetch('http://localhost:5000/api/employees/metrics')
        ]);

        const checkJSON = async (res: Response) => {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { employees, metrics, loading, error };
}