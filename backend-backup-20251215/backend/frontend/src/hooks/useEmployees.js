import { useState, useEffect, useCallback } from 'react';
import { employeeAPI } from '../services/api';

export const useEmployees = (initialParams = {}) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getAll(params);
      setEmployees(response.data || []);
    } catch (err) {
      setError(err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await employeeAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchEmployees();
    fetchStats();
  }, [fetchEmployees, fetchStats]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createEmployee = async (employeeData) => {
    try {
      const response = await employeeAPI.create(employeeData);
      await refresh();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const updateEmployee = async (id, employeeData) => {
    try {
      const response = await employeeAPI.update(id, employeeData);
      await refresh();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await employeeAPI.delete(id);
      await refresh();
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return {
    employees,
    loading,
    error,
    stats,
    params,
    setParams,
    refresh,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    fetchStats
  };
};

export const useEmployee = (id) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployee = useCallback(async () => {
    if (!id) {
      setEmployee(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getById(id);
      setEmployee(response.data);
    } catch (err) {
      setError(err);
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  return { employee, loading, error, refresh: fetchEmployee };
};
