// routes/tutor_app.js

const express = require('express');
const router = express.Router();
const db = require('../conf/database');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// GET Tutor Application Page
router.get('/', async (req, res) => {
    try {
        // Fetch subjects from the database if needed
        const [subjects] = await db.query('SELECT * FROM Subjects');

        res.render('tutor_app', {
            title: 'Tutor Application Form',
            header_name: 'Tutor Application Form',
            css: ['tutorapp.css'],
            js: ['tutorApp.js'],
            subjects: subjects, // Pass subjects fetched from DB
            userLoggedIn: !!req.session.user, // Pass login status to the frontend
        });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST Tutor Application Submission
router.post('/submit-application', uploadMiddleware, async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: 'You need to be logged in to submit your application.',
        });
    }

    const { subj, Cmsg, courses, bio, hourlyRate, videoDescription } = req.body;

    console.log('Request Body:', req.body);
    
    // Server-side validation
    if (!subj || !Cmsg || !courses || !bio || !hourlyRate || !videoDescription) {
        return res.status(400).json({
            success: false,
            message: 'All form fields are required.'
        });
    }

    try {
        console.log('Uploaded Files:', req.files);

        // Extract files from `req.files`
        const profilePic = req.files?.profilePic?.[0];
        const cv = req.files?.cv?.[0];
        const video = req.files?.video?.[0];

        if (!profilePic || !cv || !video) {
            return res.status(400).json({
                success: false,
                message: 'All files (profile picture, CV, and video) are required.',
            });
        }

        const profilePicBuffer = profilePic.buffer;
        const cvBuffer = cv.buffer;
        const videoBuffer = video.buffer;

        // Validate the subject using `subject_id`
        const [subjectRows] = await db.query('SELECT subject_id FROM Subjects WHERE subject_id = ?', [subj]);

        if (subjectRows.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid subject.' });
        }

        const subjectId = subjectRows[0].subject_id;

        // Prepare values for the INSERT statement
        const values = [
            req.session.user.id,         // user_id
            subjectId,                   // subject_id
            req.session.user.firstName,  // firstname
            req.session.user.lastName,   // lastname
            Cmsg,                        // title
            courses,                     // courses
            bio,                         // bio
            hourlyRate,                  // hrly_rate
            videoBuffer,                 // video
            videoDescription,            // video_description
            profilePicBuffer,            // profilepic
            cvBuffer,                    // cv
            'inactive'                   // status
        ];

        console.log('Values to insert:', values);
        console.log('Number of placeholders: 13');

        // Insert tutor application into the database
        await db.query(
            `INSERT INTO TutorPosts 
                (user_id, subject_id, firstname, lastname, title, courses, bio, hrly_rate, video, video_description, profilepic, cv, status, timestamp)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            values
        );

        res.json({ success: true, message: 'Application submitted successfully!' });
    } catch (error) {
        console.error('Error submitting tutor application:', error);
        res.status(500).json({ success: false, message: 'Failed to submit the application.' });
    }
});

module.exports = router;
