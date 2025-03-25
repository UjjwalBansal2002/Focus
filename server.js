require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const connectDB = require("./config/db");
const cors = require("cors");

// Initialize app
const app = express();
connectDB(); // Connect to MongoDB

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // Body parser
app.use(cors());          // Enable CORS
app.use(
    session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Routes
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Root route (Redirect to login)

app.get("/admin-login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin-login.html"));
});

// Admin login credentials

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

// Login API
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        

        req.session.admin = true; // Set admin session
       

        

        req.session.save((err) => {
            if (err) {
                
                return res.status(500).json({ success: false, message: "Internal Server Error" });
            }
            return res.json({ success: true, message: "Login successful!" });
        });
    } else {
        
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

// Logout API
// Logout Route - Clears session and redirects
app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ success: false, message: "Logout failed" });
        }
        res.clearCookie("connect.sid"); // Clear session cookie for security
        res.json({ success: true, message: "Logged out successfully!" });
    });
});


// Serve Admin Dashboard
app.get("/admin-dashboard", (req, res) => {
    if (!req.session.admin) {
        return res.redirect("/admin-login"); // Redirect if not logged in
    }
    res.sendFile(path.join(__dirname, "public", "admin-dashboard.html"));
});

// Serve Admin Login Page
app.get("/admin-login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin-login.html"));
});

// Catch-all route for other HTML pages
app.get("/:page", (req, res) => {
    const page = req.params.page;
    const allowedPages = [
        "about", "portfolio", "services",
        "contact", "book-appointment", "elements"
    ];

    if (allowedPages.includes(page)) {
        return res.sendFile(path.join(__dirname, "public", `${page}.html`));
    } else {
        res.status(404).send("Page Not Found");
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
