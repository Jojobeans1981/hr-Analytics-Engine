"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDashboardData = void 0;
// src/services/api.ts
const axios_1 = __importDefault(require("axios"));
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
const fetchDashboardData = async () => {
    try {
        const response = await axios_1.default.get(`${API_BASE_URL}/dashboard`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
};
exports.fetchDashboardData = fetchDashboardData;
