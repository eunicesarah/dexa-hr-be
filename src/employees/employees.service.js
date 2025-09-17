const employeeModel = require("./employees.model");

async function getListEmployee(page, limit) {
    const offset = (page - 1) * limit;
    const limitInt = parseInt(limit);
    const employees = await employeeModel.findAllEmployees(offset, limitInt);
    const totalEmployees = await employeeModel.findTotalEmployees();
    const totalPages = Math.ceil(totalEmployees / limit);

    return {employees: employees, pagination: { totalItems: totalEmployees, totalPages, currentPage: page, limit }};
}

async function getEmployeeById(id) {
    const employee = await employeeModel.findEmployeeById(id);
    return employee;
}

async function createEmployee(user_id, first_name, last_name, phone_number, address, salary, birth_date, start_date, end_date, position, department) {
    const employeeId = await employeeModel.addEmployee(user_id, first_name, last_name, phone_number, address, salary, birth_date, start_date, end_date, position, department);
    return { employeeId };
}

async function modifyEmployee(id, first_name, last_name, phone_number, address, birth_date, position, department, updated_by) {
    await employeeModel.updateEmployee(id, first_name, last_name, phone_number, address, birth_date, position, department, updated_by);
    return { id, first_name, last_name, phone_number, address, birth_date, position, department, updated_by };
}

async function removeEmployee(id) {
    await employeeModel.deleteEmployee(id);
}

async function adminModifyEmployee(id, first_name, last_name, phone_number, address, birth_date, position, department, salary, is_active, start_date, end_date, updated_by) {
    await employeeModel.upsertEmployeeAdmin(id, first_name, last_name, phone_number, address, birth_date, position, department, salary, is_active, start_date, end_date, updated_by);
    return { id, first_name, last_name, phone_number, address, birth_date, position, department, salary, is_active, start_date, end_date, updated_by };
}

async function getEmployeeIdByUserId(user_id) {
    const employee = await employeeModel.findEmployeeByUserId(user_id);
    return employee ? employee.id : null;
}

async function getMyEmployeeProfile(user_id) {
    const employee = await employeeModel.findEmployeeByUserId(user_id);
    return employee;
}

async function modifyProfile(employeeId, first_name, last_name, phone_number, address, birth_date, updated_by) {
    await employeeModel.updateEmployeeProfile(employeeId, first_name, last_name, phone_number, address, birth_date, updated_by);
    return { employeeId, first_name, last_name, phone_number, address, birth_date, updated_by };
}

async function updateEmployeeEmail(employeeId, email) {
    const result = await employeeModel.updateEmployeeEmail(employeeId, email);
    if (!result) {
        return { status: 400, message: 'Cannot update email' };
    }
    return { status: 200, message: 'Email updated successfully' };
}

async function getUserIdByEmployeeId(employeeId) {
    const userId = await employeeModel.findUserIdByEmployeeId(employeeId);
    if (!userId) {
        return null;
    }
    return userId;      
}

module.exports = { getListEmployee, getEmployeeById, createEmployee, modifyEmployee, removeEmployee, adminModifyEmployee, getEmployeeIdByUserId, getMyEmployeeProfile, modifyProfile, updateEmployeeEmail, getUserIdByEmployeeId };
