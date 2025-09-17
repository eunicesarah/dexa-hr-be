const db = require('../db/config');
const {v4: uuidv4} = require('uuid');

const addEmployee = async (user_id, first_name, last_name, phone_number, address, birth_date, position, department) => {
    const conn = await db.getConnection();
    try {
        const employeeId = uuidv4();
        const query = 'INSERT INTO employees (id, first_name, last_name, phone_number, address, birth_date, position, department, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())';
        const [result] = await conn.promise().query(query, [employeeId, first_name, last_name, phone_number, address, birth_date, position, department, user_id]);
        return { employeeId: employeeId, fullName : first_name + ' ' + last_name};
    } catch (error) {
        console.error(error);
        throw new Error('Error adding employee');
    } finally {
        conn.release();
    }
}

const upsertEmployeeAdmin = async (id, first_name, last_name, phone_number, address, birth_date, position, department, salary, is_active, start_date, end_date, updated_by) => {
    const conn = await db.getConnection();
    try{
        const query = 'UPDATE employees SET first_name = ?, last_name = ?, phone_number = ?, address = ?, birth_date = ?, position = ?, department = ?, salary = ?, is_active = ?, start_date = ?, end_date = ?, updated_by = ? WHERE id = ?';
        await conn.promise().query(query, [first_name, last_name, phone_number, address, birth_date, position, department, salary, is_active, start_date, end_date, updated_by, id]);
    } catch (error) {
        console.error(error);
        throw new Error('Error updating employee');
    } finally {
        conn.release();
    }
}

const updateEmployee = async (id, first_name, last_name, phone_number, address, birth_date, position, department, updated_by) => {
    const conn = await db.getConnection();
    try {
        const query = 'UPDATE employees SET first_name = ?, last_name = ?, phone_number = ?, address = ?, birth_date = ?, updated_by = ?, updated_at = NOW() WHERE id = ?';
        await conn.promise().query(query, [first_name, last_name, phone_number, address, birth_date, position, department, updated_by, id]);
    } catch (error) {
        console.error(error);
        throw new Error('Error updating employee');
    } finally {
        conn.release();
    }
}

const deleteEmployee = async (id) => {
    const conn = await db.getConnection();
    try {
        const deleteAttendance = 'DELETE FROM attendances WHERE employee_id = ?';
        await conn.promise().query(deleteAttendance, [id]);
        const query = 'DELETE FROM employees WHERE id = ?';
        await conn.promise().query(query, [id]);
    } catch (error) {
        console.error(error);
        throw new Error('Error deleting employee');
    } finally {
        conn.release();
    }
}

const updateEmployeeStatus = async (id) => {
    const conn = await db.getConnection();
    try {
        const is_active = 'SELECT is_active FROM employees WHERE id = ?';
        const [rows] = await conn.promise().query(is_active, [id]);
        const query = 'UPDATE employees SET is_active = ? WHERE id = ?';
        await conn.promise().query(query, [!rows[0].is_active, id]);
    } catch (error) {
        console.error(error);
        throw new Error('Error updating employee status');
    } finally {
        conn.release();
    }
}

const findEmployeeById = async (uid) => {
    const conn = await db.getConnection();
    try {
        const query = `SELECT 
        e.id as employee_id, 
        e.first_name, 
        e.last_name, 
        u.email, 
        e.department, 
        e.position, 
        e.address, 
        e.birth_date, 
        e.is_active, 
        e.start_date, 
        e.end_date, 
        e.salary, 
        e.phone_number 
        FROM employees e 
        LEFT JOIN users u 
        ON e.user_id = u.id 
        WHERE e.id = ?`;
        const [rows] = await conn.promise().query(query, [uid]);
        return rows[0];
    } catch (error) {
        console.error(error);
        throw new Error('Error finding employee by ID');
    } finally {
        conn.release();
    }
}

const findAllEmployees = async (offset, limit) => {
    const conn = await db.getConnection();
    try {
        const query = `SELECT
        e.id, 
        CONCAT(e.first_name, " ", e.last_name) AS full_name, 
        u.email, 
        e.department, 
        e.position,
        CASE 
            WHEN e.user_id IS NOT NULL AND u.id IS NOT NULL THEN 'Registered'
            ELSE  'Account Not Registered'
        END as status
        FROM employees e 
        LEFT JOIN users u ON e.user_id = u.id
        ORDER BY status DESC
        LIMIT ? OFFSET ?`;
        const [rows] = await conn.promise().query(query, [limit, offset]);
        return rows;
    } catch (error) {
        console.error(error);
        throw new Error('Error finding all employees');
    } finally {
        conn.release();
    }
}

const findEmployeeDetailsById = async (id) => {
    const conn = await db.getConnection();
    try {
        const query = `SELECT * FROM employees WHERE id = ?`;
        const [rows] = await conn.promise().query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error(error);
        throw new Error('Error finding employee details by ID');
    } finally {
        conn.release();
    }
}

const updateEmployeeUserId = async (employee_id, user_id) => {
    const conn = await db.getConnection();
    try {
        const query = 'UPDATE employees SET user_id = ? WHERE id = ?';
        await conn.promise().query(query, [user_id, employee_id]);
    } catch (error) {
        console.error(error);
        throw new Error('Error updating employee user ID');
    } finally {
        conn.release();
    }
}

const findEmployeeByUserId = async (user_id) => {
    const conn = await db.getConnection();
    try {
        const query = 'SELECT * FROM employees e LEFT JOIN users u ON e.user_id = u.id WHERE e.user_id = ?';
        const [rows] = await conn.promise().query(query, [user_id]);
        return rows[0];
    } catch (error) {
        console.error(error);
        throw new Error('Error finding employee by user ID');
    } finally {
        conn.release();
    }
}

const updateEmployeeEmail = async (user_id, email) => {
    const conn = await db.getConnection();
    try {
        const query = 'UPDATE users SET email = ? WHERE id = ?';
        await conn.promise().query(query, [email, user_id]);
        return true;
    } catch (error) {
        console.error(error);
        throw new Error('Error updating employee email');
    } finally {
        conn.release();
    }
}

const findTotalEmployees = async () => {
    const conn = await db.getConnection();
    try {
        const query = 'SELECT COUNT(*) as total FROM employees';
        const [rows] = await conn.promise().query(query);
        return rows[0].total;
    } catch (error) {
        console.error(error);
        throw new Error('Error finding total employees');
    } finally {
        conn.release();
    }
}

async function updateEmployeeProfile(employeeId, first_name, last_name, phone_number, address, birth_date, updated_by) {
    const conn = await db.getConnection();
    try {
        const query = 'UPDATE employees SET first_name = ?, last_name = ?, phone_number = ?, address = ?, birth_date = ?, updated_by = ?, updated_at = NOW() WHERE id = ?';
        await conn.promise().query(query, [first_name, last_name, phone_number, address, birth_date, updated_by, employeeId]);
    } catch (error) {
        console.error(error);
        throw new Error('Error updating employee profile');
    } finally {
        conn.release();
    }
}

async function findUserIdByEmployeeId(employee_id) {
    const conn = await db.getConnection();
    try {
        const query = 'SELECT user_id FROM employees WHERE id = ?';
        const [rows] = await conn.promise().query(query, [employee_id]);
        if (rows.length === 0) {
            return null; // Employee not found
        }
        return rows[0].user_id;
    } catch (error) {
        console.error(error);
        throw new Error('Error finding user ID by employee ID');
    } finally {
        conn.release();
    }
}

module.exports = {
    addEmployee,
    findEmployeeById,
    upsertEmployeeAdmin,
    updateEmployee,
    deleteEmployee,
    updateEmployeeStatus,
    findEmployeeDetailsById,
    findAllEmployees,
    updateEmployeeUserId,
    findEmployeeByUserId,
    updateEmployeeEmail,
    findTotalEmployees,
    updateEmployeeProfile,
    findUserIdByEmployeeId
};
