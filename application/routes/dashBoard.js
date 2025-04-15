/*
Author: Fernando Malca, Venkata Geetarth, Meduri

Discription:
The code above consists of two main sections: CSS styling 
for a dashboard page and an Express.js route definition for 
serving that page. The CSS is used to style the layout and 
components of the dashboard page. The .container class defines 
the main container that uses Flexbox to center and align its 
child elements vertically and horizontally, with some padding 
and spacing. The .button-group class creates a horizontal layout 
for buttons with spacing between them, while the button styling 
includes padding, font size, color, and a hover effect that changes 
the background color. The .dynamic-section class styles a section 
with a border, padding, and a light background color, ensuring it 
is responsive with a maximum width and centered horizontally. The 
text within this section is also centered, with a heading styled 
for readability. The second part of the code is a route for an 
Express.js application. It defines a route for handling a GET 
request to the dashboard page, rendering a view named 'dashBoard' 
with associated CSS and JavaScript files. The route includes a 
title, a header name, and links to external styles and scripts 
necessary for the page. The Express route ensures that when the 
dashboard page is requested, it is properly rendered with the 
correct layout and functionality.
*/


const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');

// GET /dashboard - Protected Route
router.get('/', isAuthenticated, (req, res) => {
    console.log("Dashboard accessed by user:", req.session.user.username);
    res.render('dashBoard', {
        title: 'Dashboard',
        header_name: `${req.session.user.firstName} ${req.session.user.lastName}'s Dashboard`,
        user: req.session.user,
        css: ['dashBoard.css']
    });
});

module.exports = router;
