const express = require("express");
const router = express.Router();

// GET /logout - Logs the user out and destroys the session
router.get("/", (req, res) => {
    if (req.session) {
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session during logout:", err);
                return res.redirect("/dashboard");
            }
            res.clearCookie("connect.sid"); // Clear the session cookie
            console.log("User logged out successfully.");
            res.redirect("/"); // Redirect to home page
        });
    } else {
        res.redirect("/");
    }
});

module.exports = router;
