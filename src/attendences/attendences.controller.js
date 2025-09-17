const { getTokenInfo } = require("../middleware/jwt");
const attendenceService = require("./attendences.service");
const employeeService = require("../employees/employees.service");

async function getListAttendence(req, res) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const attendences = await attendenceService.getListAttendence(page, limit);
        res.json(attendences);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getAttendenceByEmployeeId(req, res) {
    try {
        const { employee_id } = req.params;
        const attendence = await attendenceService.getAttendenceByEmployeeId(employee_id);
        if (!attendence) {
            return res.status(404).json({ message: 'Attendence not found' });
        }
        res.json(attendence);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function createAttendence(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Clock in photo is required' });
        }
        
        const photoUrl = `uploads/${req.file.filename}`;
        
        const user = req.user;
        const employee_id = await employeeService.getEmployeeIdByUserId(user.id);
        
        if (!employee_id) {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }
        
        const newAttendence = await attendenceService.createAttendence(employee_id, photoUrl);
        res.status(201).json(newAttendence);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getLoggedInAttendance(req, res) {
     try {
        const user_id = getTokenInfo(req.headers.authorization).id;
        const attendence = await attendenceService.getMyAttendance(user_id);
        if (!attendence) {
            return res.status(404).json({ message: 'Attendence not found' });
        }
        res.json(attendence);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getTodayAttendance(req, res) {
    try {
        const user_id = getTokenInfo(req.headers.authorization).id;
        const attendance = await attendenceService.getTodayAttendance(user_id);
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getListAttendence, getAttendenceByEmployeeId, createAttendence, getLoggedInAttendance, getTodayAttendance };