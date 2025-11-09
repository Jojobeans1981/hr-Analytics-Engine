"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const material_1 = require("@mui/material");
const DashboardPage_1 = __importDefault(require(".//DashboardPage"));
const DashboardPage = () => {
    return (<material_1.Container maxWidth="xl" sx={{ py: 4 }}>
      <DashboardPage_1.default />
    </material_1.Container>);
};
exports.default = DashboardPage;
