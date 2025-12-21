// Employee controller functions
const getEmployees = (req, res) => {
  res.json({ message: 'getEmployees function' });
};

const getEmployeeById = (req, res) => {
  res.json({ message: 'getEmployeeById function', id: req.params.id });
};

const updateEmployee = (req, res) => {
  res.json({ message: 'updateEmployee function', id: req.params.id });
};

const createEmployee = (req, res) => {
  res.json({ message: 'createEmployee function' });
};

const deleteEmployee = (req, res) => {
  res.json({ message: 'deleteEmployee function', id: req.params.id });
};

module.exports = {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  createEmployee,
  deleteEmployee
};
