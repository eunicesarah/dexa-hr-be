const userController = require("./users.controller");
const express = require("express");
const router = express.Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.put("/role/:id", userController.updateRoleUser);

module.exports = router;