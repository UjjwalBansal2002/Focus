const express = require("express");
const bcrypt = require("bcryptjs");
const Client = require("../models/Client");
const router = express.Router();
const Appointment = require("../models/appointment"); 
const {jwtAuthMiddleware, generateToken} = require("../jwt");
// Client Registration
// Updated Client Registration Route
router.post("/register", async (req, res) => {
    try {
        // console.log(req.body);
        const { name, email, password} = req.body;

        // console.log( name, email, password);

        // Validate input
        if (!name || !email || !password) {
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
        const newClient = new Client({ name, email, password: hashedPassword});
        console.log("newClient Data: ", newClient);



        const clientData = await newClient.save();
        console.log("Client Data: ", clientData.email);

        const payload = {
            id: clientData.id,
            email: clientData.email
        }
        console.log(payload);
        const token = generateToken(payload);
        // localStorage.setItem("token", token);

        // console.log("token: " , token);

        res.status(201).json({ success: true, message: "Client registered successfully",clientData:clientData,token: token });
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

        const payload = {
            id: client.id,
            email: client.email
        }

        const token = generateToken(payload);

        res.json({ success: true, message: "Login successful",token: token });
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
router.get("/my-Appointments/",jwtAuthMiddleware, async (req, res) => {
    try {
        // const { email } = req.params;
        const clientEmail = req.user.email; 

        if (!clientEmail) {
            return res.status(400).json({ message: "Client email not found in token." });
        }

        const appointments = await Appointment.find({clientEmail});
        // console.log(appointments)

        if (!appointments.length) {
            return res.status(404).json({ message: "No appointments found for this email." });
        }

        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching client appointments by email:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// module.exports = router;



module.exports = router;
