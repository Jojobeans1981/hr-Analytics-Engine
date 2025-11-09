"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const TrendingUp_1 = __importDefault(require("@mui/icons-material/TrendingUp"));
const TrendingDown_1 = __importDefault(require("@mui/icons-material/TrendingDown"));
const HorizontalRule_1 = __importDefault(require("@mui/icons-material/HorizontalRule"));
const MetricCard = ({ title, value, trend }) => {
    const trendIcon = {
        up: <TrendingUp_1.default color="success"/>,
        down: <TrendingDown_1.default color="error"/>,
        neutral: <HorizontalRule_1.default color="disabled"/>
    };
    return (<material_1.Card sx={{ height: '100%' }}>
      <material_1.CardContent>
        <material_1.Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {title}
        </material_1.Typography>
        <material_1.Box display="flex" alignItems="center" gap={1}>
          <material_1.Typography variant="h4">{value}</material_1.Typography>
          {trend && trendIcon[trend]}
        </material_1.Box>
      </material_1.CardContent>
    </material_1.Card>);
};
exports.default = MetricCard;
