const express = require("express");
const bcrypt = require("bcryptjs");
const Client = require("../models/Client");
const router = express.Router();
const Appointment = require("../models/appointment");

// Client Registration
// Updated Client Registration Route
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, contact } = req.body;

        console.log( name, email, password,contact);

        // Validate input
        if (!name || !email || !password || !contact) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check for existing client
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new client
        const newClient = new Client({ name, email, password: hashedPassword, contact });
        await newClient.save();

        res.status(201).json({ success: true, message: "Client registered successfully" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


// Client Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const client = await Client.findOne({ email });
        if (!client || !(await bcrypt.compare(password, client.password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        req.session.client = client._id;

        res.json({ success: true, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true, message: "Logout successful" });
    });
});

// const express = require("express");
// const router = express.Router();

// Get Client's Appointments by Contact Number
router.get("/appointments/:email", async (req, res) => {
    try {
        const { email } = req.params;
        
        const appointments = await Appointment.find({ email }).sort({ date: -1 });

        if (!appointments.length) {
            return res.status(404).json({ message: "No appointments found for this email." });
        }

        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching client appointments by email:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;



module.exports = router;
