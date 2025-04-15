const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../conf/database');
const router = express.Router();

// GET /register - Render the registration page
router.get('/', function (req, res, next) {
    console.log('Rendering registration page...');
    res.render('registration_page', {
        title: 'Registration',
        css: ['registration.css'],
    });
});

// POST /register - Handle registration form submission
router.post('/', async function (req, res, next) {
    const { firstname, lastname, username, password, email } = req.body;

    console.log('Registration attempt:', { firstname, lastname, username, email });

    if (!firstname || !lastname || !username || !password || !email) {
        console.log('Registration failed: Missing fields');
        return res.status(400).render('registration_page', {
            title: 'Registration',
            css: ['registration.css'],
            error: 'All fields are required.',
            firstname,
            lastname,
            username,
            email
        });
    }

    try {
        const [existingUsers] = await db.query(
            'SELECT * FROM RegisteredUsers WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            const existingUser = existingUsers[0];
            let errorMessage = 'Registration failed: ';
            if (existingUser.username === username && existingUser.email === email) {
                errorMessage += 'Username and Email are already in use.';
            } else if (existingUser.username === username) {
                errorMessage += 'Username is already in use.';
            } else if (existingUser.email === email) {
                errorMessage += 'Email is already in use.';
            }

            console.log(errorMessage);
            return res.status(400).render('registration_page', {
                title: 'Registration',
                css: ['registration.css'],
                error: errorMessage,
                firstname,
                lastname,
                email
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO RegisteredUsers (first_name, last_name, username, password, email) VALUES (?, ?, ?, ?, ?)',
            [firstname, lastname, username, hashedPassword, email]
        );

        console.log(`User registered successfully: ${username}`);

        // Fetch the new user to ensure consistency with the database
        const [newUserRows] = await db.query(
            'SELECT * FROM RegisteredUsers WHERE user_id = ?',
            [result.insertId]
        );

        if (newUserRows.length === 0) {
            throw new Error('Failed to retrieve new user from the database');
        }

        const newUser = newUserRows[0];

        // Save the new user in the session
        req.session.user = {
            id: newUser.user_id,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            username: newUser.username,
            email: newUser.email
        };

        console.log('Session initialized for new user:', req.session.user);

        // Redirect or restore user state after registration
        if (req.session.redirectTo) {
            const redirectPath = req.session.redirectTo;
            delete req.session.redirectTo;

            return res.redirect(redirectPath);
        }

        res.redirect('/');
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).render('registration_page', {
            title: 'Registration',
            css: ['registration.css'],
            error: 'An error occurred during registration. Please try again later.',
            firstname,
            lastname,
            username,
            email
        });
    }
});

module.exports = router;