"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const recharts_1 = require("recharts");
const RiskFactorChart = ({ data }) => {
    if (!data || data.labels.length === 0) {
        return (<material_1.Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2, height: 300 }}>
        <material_1.Typography>No data available</material_1.Typography>
      </material_1.Box>);
    }
    const chartData = data.labels.map((label, index) => ({
        name: label,
        risk: data.values[index]
    }));
    return (<material_1.Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2, height: 300 }}>
      <material_1.Typography variant="h6" gutterBottom>
        Risk Factor Distribution
      </material_1.Typography>
      <recharts_1.ResponsiveContainer width="100%" height="90%">
        <recharts_1.BarChart data={chartData}>
          <recharts_1.CartesianGrid strokeDasharray="3 3"/>
          <recharts_1.XAxis dataKey="name"/>
          <recharts_1.YAxis domain={[0, 10]}/>
          <recharts_1.Tooltip />
          <recharts_1.Bar dataKey="risk" fill="#8884d8" radius={[4, 4, 0, 0]}/>
        </recharts_1.BarChart>
      </recharts_1.ResponsiveContainer>
    </material_1.Box>);
};
exports.default = RiskFactorChart;
