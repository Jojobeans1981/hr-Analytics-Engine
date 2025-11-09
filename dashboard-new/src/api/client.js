"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/api/client.ts
const axios_1 = __importDefault(require("axios"));
const api = axios_1.default.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api', // Must match backend
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});
