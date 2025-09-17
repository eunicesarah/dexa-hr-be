const attendenceController = require("./attendences.controller");
const express = require("express");
const router = express.Router();
const { authAdmin, authEmployee } = require("../middleware/auth");
const Multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const multer = Multer({ 
    storage: Multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const userId = req.user.id;
            
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0];
            
            const fileExtension = path.extname(file.originalname);
            
            const filename = `${userId}_${dateStr}${fileExtension}`;
            
            cb(null, filename);
        }
    })
});

router.post("/", authEmployee, multer.single("clock_in_photo"), attendenceController.createAttendence);
router.get("/employee/:employee_id", authAdmin, attendenceController.getAttendenceByEmployeeId);
router.get("/", authAdmin, attendenceController.getListAttendence);
router.get("/my-attendance", authEmployee, attendenceController.getLoggedInAttendance)
router.get("/today", authEmployee, attendenceController.getTodayAttendance)

module.exports = router;