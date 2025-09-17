const userService = require("./users.service");
const employeeService = require("../employees/employees.service");

async function login(req, res) {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const result = await userService.login(email, password);
        if (result.status && result.status !== 200) {
            return res.status(result.status).json({ message: result.message });
        }
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function register(req, res) {
    try {
        const { email, password, role, employee_id } = req.body;
        if (!email || !password || !role || !employee_id) {
            return res.status(400).json({ message: 'Email, password, role, and employee ID are required' });
        }
        const checkEmployeeId = await employeeService.getEmployeeById(employee_id);
        if (checkEmployeeId.email !== null) {
            return res.status(400).json({ message: 'Account for this Employee ID already exists' });
        }
        const result = await userService.register(email, password, role, employee_id);
        res.status(201).json(result);
    } catch (error) {
        if (error.message === 'Email already in use') {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { login, register };