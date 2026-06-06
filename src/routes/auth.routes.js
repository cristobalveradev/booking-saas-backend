const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const { register, login } = require("../controllers/auth.controller");
const { createService, getServices,  deleteService }  = require("../controllers/service.controller");
const { createNewAppointment } = require("../controllers/appointments.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/createService", authenticateToken, createService )
router.get("/getServices", authenticateToken, getServices)
router.post("/createAppointment", createNewAppointment)
router.delete("/deleteService", deleteService)

module.exports = router;