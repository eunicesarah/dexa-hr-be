const employeeController = require("./employees.controller");
const express = require("express");
const router = express.Router();
const { authAdmin, authEmployee } = require("../middleware/auth");

router.post("/", authAdmin, employeeController.createEmployee);
router.put("/profile", authEmployee, employeeController.updateProfile);
router.put("/admin/:id", authAdmin, employeeController.adminUpdateEmployee);
router.put("/:id", authEmployee, employeeController.updateEmployee);
router.get("/", authAdmin, employeeController.getListEmployee);
router.get("/admin/:id", authAdmin, employeeController.getEmployeeById);
router.get("/profile", authEmployee, employeeController.getMyEmployeeProfile);
router.delete("/:id", authAdmin, employeeController.deleteEmployee);

module.exports = router;