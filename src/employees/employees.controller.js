const employeeService = require("./employees.service");
const { getTokenInfo } = require("../middleware/jwt");

async function getListEmployee(req, res) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const employees = await employeeService.getListEmployee(page, limit);
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getEmployeeById(req, res) {
    try {
        const employeeId = req.params.id;
        const employee = await employeeService.getEmployeeById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function createEmployee(req, res) {
    try {
        const { first_name, last_name, phone_number, address, birth_date, position, department } = req.body;
        if (!first_name || !last_name || !phone_number || !address || !birth_date || !position || !department) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user_id = getTokenInfo(req.headers.authorization).id;
        const newEmployee = await employeeService.createEmployee(user_id, first_name, last_name, phone_number, address, birth_date, position, department);
        res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function updateEmployee(req, res) {
    try {
        const employeeId = req.params.id;
        const { first_name, last_name, phone_number, address, birth_date, email } = req.body;
        const updated_by = getTokenInfo(req.headers.authorization).id;
        if (!first_name || !last_name || !phone_number || !address || !birth_date) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const updateEmail =  await employeeService.updateEmployeeEmail(employeeId, email);
        if (email && updateEmail && updateEmail.status !== 200) {
            return res.status(updateEmail.status).json({ message: updateEmail.message });
        }
        const updatedEmployee = await employeeService.modifyEmployee(employeeId, first_name, last_name, phone_number, address, birth_date, updated_by);
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function deleteEmployee(req, res) {
    try {
        const employeeId = req.params.id;
        await employeeService.removeEmployee(employeeId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function adminUpdateEmployee(req, res) {
    try {
        const employeeId = req.params.id;
        const updated_by = req.headers.authorization.id;
        const { first_name, last_name, phone_number, address, birth_date, position, department, salary, is_active, start_date, end_date, email } = req.body;
        if (!first_name || !last_name || !phone_number || !address || !birth_date || !position || !department || salary === undefined || is_active === undefined || !start_date) {
            return res.status(400).json({ message: 'All fields except end_date are required' });
        }
        const updateEmail = email ? await employeeService.updateEmployeeEmail(employeeId, email) : null;
        if (email && updateEmail && updateEmail.status !== 200) {
            return res.status(updateEmail.status).json({ message: updateEmail.message });
        }
        const updatedEmployee = await employeeService.adminModifyEmployee(employeeId, first_name, last_name, phone_number, address, birth_date, position, department, salary, is_active, start_date, end_date, updated_by);
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function getMyEmployeeProfile(req, res) {
    try {
        const user_id = getTokenInfo(req.headers.authorization).id;
        const employee = await employeeService.getMyEmployeeProfile(user_id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee profile not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function updateProfile(req, res) {
    try {
        const user_id = getTokenInfo(req.headers.authorization).id;
        const { first_name, last_name, phone_number, address, birth_date, email } = req.body;
        if (!first_name || !last_name || !phone_number || !address || !birth_date || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const employeeId = await employeeService.getEmployeeIdByUserId(user_id);
        if (!employeeId) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        if (email) {
            const updateEmail = await employeeService.updateEmployeeEmail(employeeId, email);
            
            if (updateEmail && updateEmail.status !== 200) {
                return res.status(updateEmail.status).json({ message: updateEmail.message });
            }
        }
        const updatedEmployee = await employeeService.modifyProfile(employeeId, first_name, last_name, phone_number, address, birth_date, user_id);
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getListEmployee, getEmployeeById, createEmployee, updateEmployee, deleteEmployee, adminUpdateEmployee, getMyEmployeeProfile, updateProfile };