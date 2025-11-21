"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchEmployees = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/employees');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
        }
        return await response.json();
    }
    catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
exports.default = fetchEmployees;
