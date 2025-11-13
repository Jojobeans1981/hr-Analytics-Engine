// src/components/dashboard/Dashboard.tsx

/* eslint-disable no-undef */
import React, { useEffect, useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";

import GroupIcon from "@mui/icons-material/Group";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ClearIcon from "@mui/icons-material/Clear";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import WarningIcon from "@mui/icons-material/Warning";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";


import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";

import { getDashboardMetrics, getEmployees } from "../../api/dashboard.api";

// Types for our monitoring data
interface Employee {
  _id: string;
  name: string;
  email: string;
  department: string;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High";
}

interface Summary {
  totalEmployees: number;
  avgRisk: number;
  departments: string[];
  riskLevels: {
    Low: number;
    Medium: number;
    High: number;
  };
}

interface WebSocketMessage {
  type: 'employee_updated' | 'employee_added' | 'employee_removed' | 'risk_alert' | 'welcome' | 'metrics_update' | 'heartbeat';
  data?: any;
  message?: string;
  timestamp?: string;
}

interface MetricData {
  timestamp: number;
  value: number;
  instance?: string;
  job?: string;
}

interface SystemAlert {
  id: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  activeSince: number;
  instance: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const RISK_COLORS = {
  Low: "#4CAF50",
  Medium: "#FFC107",
  High: "#F44336"
};

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [timeRange, setTimeRange] = useState('1h');
  const [isLoading, setIsLoading] = useState(false);

  // Debug effect
  useEffect(() => {
    console.log('🔍 DEBUG - Current state:', {
      summary,
      employees,
      hasSummary: !!summary,
      hasEmployees: !!employees
    });
  }, [summary, employees]);

  // Mock metrics data for Prometheus-style charts
  const riskTrendData = useMemo((): MetricData[] => {
    const data: MetricData[] = [];
    const points = timeRange === '1h' ? 60 : timeRange === '6h' ? 360 : 1440;
    const baseValue = summary?.avgRisk || 45;

    for (let i = 0; i < points; i++) {
      data.push({
        timestamp: Date.now() - (points - i) * 60000,
        value: baseValue + Math.random() * 20 + Math.sin(i * 0.1) * 10,
        instance: 'risk-monitor',
        job: 'talent-risk'
      });
    }
    return data;
  }, [timeRange, summary]);

  const employeeCountData = useMemo((): MetricData[] => {
    const data: MetricData[] = [];
    const points = timeRange === '1h' ? 60 : timeRange === '6h' ? 360 : 1440;
    const baseValue = summary?.totalEmployees || 100;

    for (let i = 0; i < points; i++) {
      data.push({
        timestamp: Date.now() - (points - i) * 60000,
        value: baseValue + Math.floor(Math.random() * 10) - 3,
        instance: 'employee-tracker',
        job: 'talent-risk'
      });
    }
    return data;
  }, [timeRange, summary]);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      setConnectionStatus('connecting');

      const socket = new WebSocket('wss://prometheus-talent-engine-production.up.railway.app');

      socket.onopen = () => {
        console.log('✅ Connected to WebSocket server');
        setConnectionStatus('connected');
        setLastUpdate(new Date().toLocaleTimeString());
      };

      socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', message);
          handleWebSocketMessage(message);
        } catch (error) {
          console.log('Raw WebSocket message:', event.data);
        }
      };

      socket.onclose = () => {
        console.log('❌ WebSocket connection closed');
        setConnectionStatus('disconnected');
        setTimeout(connectWebSocket, 3000);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
      };

      return () => {
        socket.close();
      };
    };

    connectWebSocket();
  }, []);

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    setLastUpdate(new Date().toLocaleTimeString());

    switch (message.type) {
      case 'employee_updated':
        setEmployees(prev => prev ? prev.map(emp =>
          emp._id === message.data._id ? { ...emp, ...message.data } : emp
        ) : [message.data]);
        addAlert('warning', `Employee Risk Updated`, `${message.data.name} risk score changed to ${message.data.riskScore}`);
        break;

      case 'employee_added':
        setEmployees(prev => [...prev, message.data]);
        addAlert('info', 'New Employee Added', `${message.data.name} joined ${message.data.department}`);
        break;

      case 'employee_removed':
        setEmployees(prev => prev.filter(emp => emp._id !== message.data._id));
        addAlert('warning', 'Employee Removed', `${message.data.name} was removed from the system`);
        break;

      case 'risk_alert':
        addAlert('error', 'High Risk Alert', message.message || 'Critical risk level detected');
        break;

      case 'metrics_update':
        refreshSummaryData();
        break;

      case 'welcome':
        console.log('WebSocket:', message.message);
        break;

      case 'heartbeat':
        console.log('💓 Heartbeat received');
        break;

      default:
        console.log('Unknown message type:', message);
    }
  };

  const addAlert = (severity: 'error' | 'warning' | 'info', title: string, description: string) => {
    const newAlert: SystemAlert = {
      id: Date.now().toString(),
      severity,
      title,
      description,
      activeSince: Date.now(),
      instance: 'talent-risk-system'
    };

    setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts

    // Auto-remove info alerts after 30 seconds, others after 2 minutes
    const timeout = severity === 'info' ? 30000 : 120000;
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
    }, timeout);
  };

  const refreshSummaryData = async () => {
    try {
      setIsLoading(true);
      const summaryData = await getDashboardMetrics();
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to refresh summary:', error);
      addAlert('error', 'Data Fetch Error', 'Failed to refresh dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log('🔄 Starting API calls...');
        
        const [summaryData, employeesData] = await Promise.all([
          getDashboardMetrics(),
          getEmployees()
        ]);
        
        console.log('✅ API Responses:', {
          summaryData,
          employeesData,
          hasSummaryData: !!summaryData,
          hasEmployeesData: !!employeesData,
          employeesLength: employeesData?.length
        });
        
        setSummary(summaryData);
        setEmployees(employeesData || []);
      } catch (error) {
        console.error('❌ API Error:', error);
        addAlert('error', 'Initialization Error', 'Failed to load dashboard data');
        
        // If APIs fail, just set empty states
        setSummary(null);
        setEmployees([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ LOADING CHECK - Only check for summary
  if (!summary) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant="h4">Loading Dashboard Data...</Typography>
        <Typography variant="body1" color="textSecondary">
          Initializing dashboard... (Employees loaded: {employees.length})
        </Typography>
      </div>
    );
  }

  const handleClearFilters = () => {
    setSearchTerm("");
    setDeptFilter("");
    setRiskFilter("");
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter ? emp.department === deptFilter : true;
    const matchesRisk = riskFilter ? emp.riskLevel === riskFilter : true;
    return matchesSearch && matchesDept && matchesRisk;
  });

  const departmentData = summary.departments?.map((dept) => ({
    name: dept,
    value: employees.filter((e) => e.department === dept).length,
  }));

  const riskData = [
    { name: "Low", value: summary.riskLevels.Low, color: RISK_COLORS.Low },
    { name: "Medium", value: summary.riskLevels.Medium, color: RISK_COLORS.Medium },
    { name: "High", value: summary.riskLevels.High, color: RISK_COLORS.High },
  ];

  // Calculate metrics for Prometheus-style display
  const highRiskPercentage = ((summary?.riskLevels?.High || 0) / (summary?.totalEmployees || 1) * 100).toFixed(1);
  const riskTrend = summary.avgRisk > 50 ? 'up' : 'down';

  return (
    <div className="p-6 space-y-6">
      {/* ===== Prometheus-style Header ===== */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Talent Risk Monitoring
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              icon={connectionStatus === 'connected' ? <WifiIcon /> : <WifiOffIcon />}
              label={`Prometheus WS: ${connectionStatus}`}
              color={connectionStatus === 'connected' ? 'success' : 'default'}
              variant="outlined"
            />
            <Chip
              icon={<WarningIcon />}
              label={`${alerts.filter(a => a.severity === 'error').length} Critical`}
              color="error"
              variant="outlined"
            />
            {lastUpdate && (
              <Typography variant="caption" color="textSecondary">
                Last scrape: {lastUpdate}
              </Typography>
            )}
          </Box>
        </Box>

        <Box display="flex" gap={1}>
          <FormControl size="small" variant="outlined">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="1h">1h</MenuItem>
              <MenuItem value="6h">6h</MenuItem>
              <MenuItem value="24h">24h</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            onClick={refreshSummaryData}
            disabled={isLoading}
            startIcon={<TrendingUpIcon />}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {isLoading && <LinearProgress />}

      {/* ===== Alert Panel ===== */}
      {alerts.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🚨 Active Alerts
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {alerts?.map((alert) => (
                <Alert
                  key={alert.id}
                  severity={alert.severity}
                  icon={alert.severity === 'error' ? <WarningIcon /> : undefined}
                >
                  <Typography variant="subtitle2">{alert.title}</Typography>
                  <Typography variant="body2">{alert.description}</Typography>
                </Alert>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ===== Prometheus-style Metrics Grid ===== */}
      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <GroupIcon color="primary" />
                <Typography variant="h6">Total Employees</Typography>
              </Box>
              <Typography variant="h4">{summary.totalEmployees}</Typography>
              <Typography variant="caption" color="textSecondary">
                Active workforce
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <ShowChartIcon color="secondary" />
                <Typography variant="h6">Avg Risk Score</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h4">
                  {(summary?.avgRisk ?? 0).toFixed(1)}
                </Typography>
                {riskTrend === 'up' ? <TrendingUpIcon color="error" /> : <TrendingDownIcon color="success" />}
              </Box>
              <Typography variant="caption" color="textSecondary">
                Overall risk level
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <WarningIcon style={{ color: RISK_COLORS.High }} />
                <Typography variant="h6">High Risk %</Typography>
              </Box>
              <Typography variant="h4" style={{ color: RISK_COLORS.High }}>
                {highRiskPercentage}%
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {summary.riskLevels.High} employees
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <ApartmentIcon style={{ color: "#00C49F" }} />
                <Typography variant="h6">Departments</Typography>
              </Box>
<Typography variant="h4">{summary?.departments?.length ?? 0}</Typography>
              <Typography variant="caption" color="textSecondary">
                Active departments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ===== Time Series Charts ===== */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Score Trend
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Employee Count Trend
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={employeeCountData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ===== Distribution Charts ===== */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Employees by Department
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {departmentData?.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Level Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={riskData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {riskData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Level Breakdown
              </Typography>
              <Box display="flex" flexDirection="column" gap={2} mt={2}>
                {riskData?.map((risk) => (
                  <Box key={risk.name} display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        width={12}
                        height={12}
                        borderRadius="50%"
                        bgcolor={risk.color}
                      />
                      <Typography variant="body2">{risk.name}</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="bold">
                      {risk.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box mt={3}>
                <Typography variant="body2" color="textSecondary">
                  Total monitored: {summary.totalEmployees} employees
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ===== Employee Data Table ===== */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Employee Risk Registry
          </Typography>

          {/* Filters */}
          <Box display="flex" gap={2} alignItems="center" mb={3} flexWrap="wrap">
            <TextField
              label="Search employees..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Department</InputLabel>
              <Select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                label="Department"
              >
                <MenuItem value="">All</MenuItem>
                {summary.departments?.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Risk Level</InputLabel>
              <Select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                label="Risk Level"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>

            {(searchTerm || deptFilter || riskFilter) && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
              >
                Clear
              </Button>
            )}
          </Box>

          {/* Employee Table */}
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e0e0e0' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '12px', border: '1px solid #e0e0e0', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', border: '1px solid #e0e0e0', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '12px', border: '1px solid #e0e0e0', textAlign: 'left' }}>Department</th>
                  <th style={{ padding: '12px', border: '1px solid #e0e0e0', textAlign: 'left' }}>Risk Level</th>
                  <th style={{ padding: '12px', border: '1px solid #e0e0e0', textAlign: 'left' }}>Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees?.map((emp) => (
                    <tr key={emp._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ padding: '12px', border: '1px solid #e0e0e0' }}>{emp.name}</td>
                      <td style={{ padding: '12px', border: '1px solid #e0e0e0' }}>{emp.email}</td>
                      <td style={{ padding: '12px', border: '1px solid #e0e0e0' }}>{emp.department}</td>
                      <td style={{ padding: '12px', border: '1px solid #e0e0e0' }}>
                        <Chip
                          label={emp.riskLevel}
                          size="small"
                          style={{
                            backgroundColor: RISK_COLORS[emp.riskLevel],
                            color: 'white'
                          }}
                        />
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #e0e0e0' }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography>{emp.riskScore}</Typography>
                          {emp.riskScore > 70 && <WarningIcon style={{ color: RISK_COLORS.High, fontSize: 16 }} />}
                        </Box>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
                      No employees found with these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;