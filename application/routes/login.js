const express = require("express");
const bcrypt = require("bcrypt");
const db = require('../conf/database'); // Ensure this path is correct
const router = express.Router();

console.log("Login Router Initialized");

router.get("/", function (req, res) {
    console.log("GET /login called");
    res.render("partials/loginPopUp", { 
        css: ['registration.css'],
        layout: false
    });
});


router.post("/", async function (req, res) {
    const { username, password } = req.body;

    console.log("Login attempt received for username:", username);

    try {
        const [rows] = await db.query(
            "SELECT * FROM RegisteredUsers WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            console.log("Login failed: User not found");
            return res.status(401).json({ success: false, message: "Username not found." });
        }

        const user = rows[0];
        console.log("User found:", user.username);

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("Login failed: Incorrect password");
            return res.status(401).json({ success: false, message: "Incorrect password." });
        }

        // Save user details in session
        req.session.user = {
            id: user.user_id,
            username: user.username,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name
        };

        req.session.save((err) => {
            if (err) {
                console.error("Error saving session:", err);
                return res.status(500).json({ success: false, message: "Failed to save session." });
            }

            console.log("Session after login:", req.session.user);

            console.log("Login successful for username:", username);

            res.json({ success: true });
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "An error occurred during login. Please try again." });
    }
});



module.exports = router;
