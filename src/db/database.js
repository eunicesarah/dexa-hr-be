const db = require('./config');
const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');

async function seed() {
    const conn = await db.getConnection();
    try {
        const [rows] = await conn.promise().query("SELECT COUNT(*) as count FROM users");
        if (rows[0].count > 0) {
            console.log("ℹ️ Seed skipped: Users already exist");
            return;
        }

        const adminPass = await bcrypt.hash("admin123", 10);
        const employeePass = await bcrypt.hash("employee123", 10);

        const userAdmin = uuidv4();
        const userEmp1 = uuidv4();
        const userEmp2 = uuidv4();

        const empAdmin = uuidv4();
        const emp1 = uuidv4();
        const emp2 = uuidv4();

        await conn.promise().query(`
           INSERT INTO Users (id, email, password_hash, role, created_at, updated_at) VALUES
            (?, 'admin@example.com', ?, 'ADMIN', NOW(), NOW()),
            (?, 'employee1@example.com', ?, 'EMPLOYEE', NOW(), NOW()),
            (?, 'employee2@example.com', ?, 'EMPLOYEE', NOW(), NOW())
        `, [userAdmin, adminPass, userEmp1, employeePass, userEmp2, employeePass]);

        await conn.promise().query(`
            INSERT INTO employees (id, user_id, first_name, last_name, phone_number, address, birth_date, salary, position, department, is_active, start_date, updated_at, updated_by)
            VALUES
            (?, ?, 'Alice', 'Admin', '081234567890', 'Jakarta', '1990-05-15', 15000000, 'System Administrator', 'IT', 1, '2020-01-01', NOW(), 'system'),
            (?, ?, 'Bob', 'Employee', '081298765432', 'Bandung', '1995-08-20', 7000000, 'Software Engineer', 'IT', 1, '2022-01-01', NOW(), 'system'),
            (?, ?, 'Charlie', 'Employee', '081277788899', 'Surabaya', '1993-12-05', 7500000, 'HR Staff', 'HR', 1, '2021-05-10', NOW(), 'system')
        `, [empAdmin, userAdmin, emp1, userEmp1, emp2, userEmp2]);

        console.log("✅ Seed completed: Admin and employee users created");
    } catch (error) {
        console.error(error);
    } finally {
        conn.release();
    }
}

async function tables()  {
    const conn = await db.getConnection();
    try {
        await conn.promise().query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(36) NOT NULL PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('EMPLOYEE','ADMIN') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL
            );
        `);

        await conn.promise().query(`
            CREATE TABLE IF NOT EXISTS employees (
                id VARCHAR(36) NOT NULL PRIMARY KEY,
                user_id VARCHAR(36) UNIQUE,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                phone_number VARCHAR(20) NOT NULL,
                address VARCHAR(255) NOT NULL,
                birth_date DATE,
                salary FLOAT,
                position VARCHAR(100) NOT NULL,
                department VARCHAR(100) NOT NULL,
                is_active TINYINT(1) NOT NULL DEFAULT 1,
                start_date DATE,
                end_date DATE,
                updated_at TIMESTAMP NULL,
                updated_by VARCHAR(36),
                CONSTRAINT fk_employee_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );
        `);

        await conn.promise().query(`
            CREATE TABLE IF NOT EXISTS attendances (
                id VARCHAR(36) NOT NULL PRIMARY KEY,
                employee_id VARCHAR(36) NOT NULL,
                clock_in_time TIME NOT NULL,
                clock_in_date DATE NOT NULL,
                clock_in_photo VARCHAR(255) NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE
            );
        `);

        console.log("✅ Tables ensured");
    } catch (error) {
        console.error(error);
    } finally {
        conn.release();
    }
}

module.exports = { seed, tables };