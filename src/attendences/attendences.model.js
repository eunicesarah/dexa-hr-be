const db = require('../db/config');
const { v4: uuidv4 } = require('uuid');

const addAttendence = async (employee_id, clock_in_photo) => {
    const conn = await db.getConnection();
    try {
        const attendenceId = uuidv4();
        const query = 'INSERT INTO attendances (id, employee_id, clock_in_date, clock_in_time, clock_in_photo) VALUES (?, ?, CURDATE(), CURTIME(), ?)';
        const [result] = await conn.promise().query(query, [attendenceId, employee_id, clock_in_photo]);
        return { attendenceId, employee_id };
    } catch (error) {
        console.error(error);
        throw new Error('Error adding attendence');
    } finally {
        conn.release();
    }
}

const findAllAttendences = async (offset, limit) => {
    const conn = await db.getConnection();
    try {
        const query = `SELECT 
                e.id as employee_id,
                CONCAT(e.first_name, " ", e.last_name) AS employee_name,
                e.position,
                e.department,
                a.clock_in_date,
                a.clock_in_time,
                a.clock_in_photo,
                CASE 
                    WHEN a.clock_in_time <= '08:00:00' THEN 'On Time'
                    WHEN a.clock_in_time > '08:00:00' THEN 'Late'
                    ELSE 'Absent'
                END as status
            FROM employees e 
            LEFT JOIN attendances a ON e.id = a.employee_id 
            ORDER BY a.clock_in_date DESC, a.clock_in_time DESC
            LIMIT ? OFFSET ?`;
        const [rows] = await conn.promise().query(query, [limit, offset]);
        return rows;
    } catch (error) {
        console.error(error);
        throw new Error('Error finding all attendences');
    } finally {
        conn.release();
    }
}

const findAttendenceByEmployeeId = async (employee_id) => {
    const conn = await db.getConnection();
    try {
        const query = 'SELECT * FROM attendances WHERE employee_id = ?';
        const [rows] = await conn.promise().query(query, [employee_id]);
        return rows;
    } catch (error) {
        console.error(error);
        throw new Error('Error finding attendence by employee ID');
    } finally {
        conn.release();
    }
}

const findMyAttendance = async (user_id) => {
    const conn = await db.getConnection();
    try {
        const query = `SELECT a.clock_in_date, a.clock_in_time, a.clock_in_photo,
        CASE 
                    WHEN a.clock_in_time <= '08:00:00' THEN 'On Time'
                    WHEN a.clock_in_time > '08:00:00' THEN 'Late'
                    ELSE 'Absent'
        END as status
        FROM users u
        LEFT JOIN employees e ON u.id = e.user_id
        LEFT JOIN attendances a ON a.employee_id = e.id
        WHERE u.id = ?
        ORDER BY a.clock_in_date DESC, a.clock_in_time DESC
        `
        const [rows] = await conn.promise().query(query, [user_id]);
        return rows
    } catch (error) {
        console.error(error);
        throw new Error('Error finding my attendance');
    } finally {
        conn.release();
    }
}   

const findTodayAttendance = async (user_id) => {
    const conn = await db.getConnection();
    try {
        const query = `SELECT COUNT(*) as count
            FROM users u
            LEFT JOIN employees e ON u.id = e.user_id
            LEFT JOIN attendances a ON a.employee_id = e.id
            WHERE u.id = ?
            AND a.clock_in_date = CURDATE()`;
        const [rows] = await conn.promise().query(query, [user_id]);
        return rows[0].count > 0;
    } catch (error) {
        console.error(error);
        throw new Error('Error finding today\'s attendance');
    } finally {
        conn.release();
    }
}

const findTotalAttendences = async () => {
    const conn = await db.getConnection();
    try {
        const query = 'SELECT COUNT (*) as count  FROM employees e LEFT JOIN attendances a ON e.id = a.employee_id ';
        const [rows] = await conn.promise().query(query);
        return rows[0].count;
    } catch (error) {
        console.error(error);
        throw new Error('Error finding total attendences');
    } finally {
        conn.release();
    }
}

module.exports = {
    addAttendence,
    findAllAttendences,
    findAttendenceByEmployeeId,
    findMyAttendance,
    findTodayAttendance,
    findTotalAttendences
};