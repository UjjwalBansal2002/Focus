const mongoose = require("mongoose");

const bookAppointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    
}, { timestamps: true });

module.exports = mongoose.model("appointment", bookAppointmentSchema);
