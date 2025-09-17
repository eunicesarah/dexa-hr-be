const userModel = require('./users.model');
const employeeModel = require('../employees/employees.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/jwt');

async function login(email, password) {
    const user = await userModel.findUserByEmail(email);
    if (!user) {
        return {message: 'Email not found, please register', status: 404};
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        return {message: 'Invalid email or password', status: 401};
    }
    const token = generateToken(user);
    return {token: token, status: 200};
}

async function register(email, password, role, employee_id) {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
        return {message: 'Email already in use', status: 400};
    }
    const validateEmployee = await employeeModel.findEmployeeById(employee_id);
    if (validateEmployee == null) {
        return {message: 'Invalid employee ID', status: 400};
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await userModel.addUser(email, password_hash, role);
    await employeeModel.updateEmployeeUserId(employee_id, user.id);
    await employeeModel.updateEmployeeEmail(employee_id, email);
    return { 
        message: 'User registered successfully',
        user: { id: user.id, email, role },
        status: 201 
    };
}

module.exports = { login, register };