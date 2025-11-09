// src/components/Dashboard.tsx
import React, { useEffect, useState } from "react";
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

import GroupIcon from "@mui/icons-material/Group";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ClearIcon from "@mui/icons-material/Clear";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { getDashboardMetrics, getEmployees } from "../../api/dashboard.api";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const summaryData = await getDashboardMetrics();
      setSummary(summaryData);

      const employeesData = await getEmployees();
      setEmployees(employeesData);
    };
    fetchData();
  }, []);

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

  if (!summary) return <div>Loading...</div>;

  const departmentData = summary.departments.map((dept) => ({
    name: dept,
    value: employees.filter((e) => e.department === dept).length,
  }));

  const riskData = [
    { name: "Low", value: summary.riskLevels.Low },
    { name: "Medium", value: summary.riskLevels.Medium },
    { name: "High", value: summary.riskLevels.High },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* ===== Metric Cards ===== */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent className="flex items-center space-x-3">
              <GroupIcon color="primary" />
              <div>
                <Typography variant="h6">Total Employees</Typography>
                <Typography variant="h4">{summary.totalEmployees}</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent className="flex items-center space-x-3">
              <ShowChartIcon color="secondary" />
              <div>
                <Typography variant="h6">Average Risk</Typography>
                <Typography variant="h4">
                  {summary.avgRisk.toFixed(2)}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent className="flex items-center space-x-3">
              <ApartmentIcon style={{ color: "#00C49F" }} />
              <div>
                <Typography variant="h6">Departments</Typography>
                <Typography variant="h4">
                  {summary.departments.length}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ===== Charts ===== */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
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
                    {departmentData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
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
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ===== Filters + Employee Table ===== */}
      <Card>
        <CardContent>
          <div className="flex space-x-4 items-center mb-4">
            {/* 🔍 Search Field */}
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* 🏢 Department Filter */}
            <FormControl variant="outlined" size="small">
              <InputLabel>Department</InputLabel>
              <Select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                label="Department"
              >
                <MenuItem value="">All</MenuItem>
                {summary.departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* ⚠️ Risk Filter */}
            <FormControl variant="outlined" size="small">
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

            {/* ✅ Clear Filters (only when active) */}
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
          </div>

          {/* Employee Table */}
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Department</th>
                <th className="p-2 border">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{emp.name}</td>
                    <td className="p-2 border">{emp.email}</td>
                    <td className="p-2 border">{emp.department}</td>
                    <td className="p-2 border">
                      <span
                        className={`px-2 py-1 rounded-full text-white text-sm ${
                          emp.riskLevel === "Low"
                            ? "bg-green-500"
                            : emp.riskLevel === "Medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {emp.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No employees found with these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;