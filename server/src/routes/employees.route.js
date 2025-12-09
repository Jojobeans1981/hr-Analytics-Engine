"use strict";
const express = require("express");
const router = express.Router();

// Employees routes
router.get('/', (req, res) => {
  const employees = [
    {id: 1, name: "John Doe", department: "Engineering", riskScore: 85, email: "john@example.com", position: "Senior Developer"},
    {id: 2, name: "Jane Smith", department: "Product", riskScore: 72, email: "jane@example.com", position: "Product Manager"},
    {id: 3, name: "Bob Johnson", department: "Sales", riskScore: 68, email: "bob@example.com", position: "Sales Executive"},
    {id: 4, name: "Alice Brown", department: "Engineering", riskScore: 91, email: "alice@example.com", position: "Tech Lead"},
    {id: 5, name: "Charlie Wilson", department: "Marketing", riskScore: 59, email: "charlie@example.com", position: "Marketing Specialist"},
    {id: 6, name: "Diana Lee", department: "Engineering", riskScore: 77, email: "diana@example.com", position: "Software Engineer"},
    {id: 7, name: "Evan Garcia", department: "Product", riskScore: 82, email: "evan@example.com", position: "UX Designer"},
    {id: 8, name: "Fiona Chen", department: "HR", riskScore: 45, email: "fiona@example.com", position: "HR Manager"},
    {id: 9, name: "George Miller", department: "Sales", riskScore: 63, email: "george@example.com", position: "Account Executive"},
    {id: 10, name: "Hannah Davis", department: "Engineering", riskScore: 88, email: "hannah@example.com", position: "DevOps Engineer"}
  ];
  
  res.json(employees);
});

module.exports = router;
