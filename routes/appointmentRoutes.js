const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");



const { jwtAuthMiddleware, generateToken } = require("../jwt");

router.post('/createAppointment', jwtAuthMiddleware, async (req, res) => {
    try {
        const { name, contact, service, date, time } = req.body;


        // Validate required fields
        if (!name || !contact || !service || !date || !time) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Create a new appointment and store client's email from JWT
        const newAppointment = new Appointment({
            name,
            contact,
            service,
            date,
            time,
            email: req.user.email
        });

        await newAppointment.save();
        res.status(201).json({ success: true, message: "Appointment booked successfully", appointment: newAppointment });
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.get('/appointments', jwtAuthMiddleware, async (req, res) => {
    try {
        const appointments = await Appointment.find({ clientEmail: req.clientEmail });

        res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
