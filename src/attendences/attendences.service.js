const attendenceModel = require("./attendences.model");

async function getListAttendence(page, limit) {
    const offset = (page - 1) * limit;
    const limitInt = parseInt(limit);
    const attendences = await attendenceModel.findAllAttendences(offset, limitInt);
    const totalAttendences = await attendenceModel.findTotalAttendences();
    return { attendances: attendences, pagination: { totalItems: totalAttendences, totalPages: Math.ceil(totalAttendences / limitInt), currentPage: page, pageSize: limitInt } };
}

async function getAttendenceByEmployeeId(employee_id) {
    const attendence = await attendenceModel.findAttendenceByEmployeeId(employee_id);
    return attendence;
}

async function createAttendence(employee_id, clock_in_photo) {
    const attendenceId = await attendenceModel.addAttendence(employee_id, clock_in_photo);
    return { id: attendenceId, employee_id, clock_in_photo };
}

async function getMyAttendance(user_id) {
    const attendance = await attendenceModel.findMyAttendance(user_id);
    return attendance;
}

async function getTodayAttendance(user_id) {
    const attendance = await attendenceModel.findTodayAttendance(user_id);
    return attendance;
}

module.exports = { getListAttendence, getAttendenceByEmployeeId, createAttendence, getMyAttendance, getTodayAttendance };