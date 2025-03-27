const Appointment = require("../models/appointment");
const {jwtAuthMiddleware, generateToken} = require("../jwt");



// ✅ Create a new appointment
const createAppointment = async (req, res) => {
    try {
        const { name, contact, service, date, time } = req.body;

        // Create a new appointment with default status "Pending"
        // const pendingStatus = await Status.findOne({ name: "Pending" });
        // console.log({ name, contact, service, date, time })

        console.log(req.clientEmail)

        const newAppointment = new Appointment({
            name,
            contact,
            service,
            date,
            clientEmail: req.clientEmail,
            time
            
            // status: pendingStatus ? pendingStatus._id : null // Set default status
        });

        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Fetch all appointments (with status populated)
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Fetch a single appointment by ID
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json(appointment);
    } catch (error) {
        console.error("Error fetching appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Update appointment details
const updateAppointment = async (req, res) => {
    try {
        const { name, contact, service, date, time } = req.body;
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { name, contact, service, date, time },
            { new: true }
        )

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json(updatedAppointment);
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// ✅ Delete an appointment
const deleteAppointment = async (req, res) => {
    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!deletedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Export all controllers
module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
};
