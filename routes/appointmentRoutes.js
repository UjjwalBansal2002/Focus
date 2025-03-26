const express = require("express");
const { 
    createAppointment, 
    getAppointments// ✅ Ensure this function is imported
} = require("../controllers/appointmentController");  // ✅ Make sure this path is correct

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAppointments);
     // ✅ Ensure this function exists

module.exports = router;