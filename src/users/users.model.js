const db = require('../db/config');
const {v4: uuidv4} = require('uuid');

const addUser = async (email, password_hash, role) => {
    const conn = await db.getConnection();
    try{
        const userId = uuidv4();
        const query = 'INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)';
        const [result] = await conn.promise().query(query, [userId, email, password_hash, role]);
        return { id: userId, email, role };
    }
    catch (error) {
        console.error(error);
        throw new Error('Error adding user');
    }
    finally {
        conn.release();
    }
}

const findUserByEmail = async (email) => {
    const conn = await db.getConnection();
    try {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await conn.promise().query(query, [email]);
        return rows[0];
    } catch (error) {
        console.error(error);
        throw new Error('Error finding user by email');
    } finally {
        conn.release();
    }
}

const deleteUser = async (id) => {
    const conn = await db.getConnection();
    try {
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await conn.promise().query(query, [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error(error);
        throw new Error('Error deleting user');
    } finally {
        conn.release();
    }
}

const findUserById = async (id) => {
    const conn = await db.getConnection();
    try {
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await conn.promise().query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error(error);
        throw new Error('Error finding user by ID');
    } finally {
        conn.release();
    }
}

const updateRoleUser = async (id, role) => {
   const conn = await db.getConnection();
    try {
        const getCurrentRoleQuery = 'SELECT role FROM users WHERE id = ?';
        const [userRows] = await conn.promise().query(getCurrentRoleQuery, [id]);
        
        if (userRows.length === 0) {
            throw new Error('User not found');
        }
        
        const currentRole = userRows[0].role || '';
        let newRole;
        
        const findInSet =  `SELECT FIND_IN_SET(?, ?)`
        const [findInSetResult] = await conn.promise().query(findInSet, [role, currentRole]);
        if (findInSetResult[0]['FIND_IN_SET(?, ?)'] > 0) {
            return { success: true, message: 'Role already assigned', newRole: currentRole };
        }
        if (currentRole === '') {
            newRole = role;
        } else {
            newRole = `${currentRole},${role}`;
        }
        
        const updateQuery = 'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?';
        const [result] = await conn.promise().query(updateQuery, [newRole, id]);
        
        if (result.affectedRows === 0) {
            throw new Error('Failed to update user role');
        }
        
        return { success: true, message: 'Role updated successfully', newRole };
    } catch (error) {
        console.error(error);
        throw new Error('Error updating user role');
    } finally {
        conn.release();
    }
}


module.exports = {
    addUser,
    findUserByEmail,
    findUserById,
    deleteUser,
    updateRoleUser
};