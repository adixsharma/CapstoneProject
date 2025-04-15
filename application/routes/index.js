/*
Authors:
    Fernando Malca, Aditya Sharma
    
*/

var express = require('express');
var router = express.Router();
const db = require('../conf/database');

/* GET index page. */
router.get('/', async function (req, res, next) {
    try {
        const sql = `
            SELECT
                post.tutor_id,
                user.first_name,
                user.last_name,
                subject.subject_name,
                post.courses,
                post.profilepic,
                post.cv,
                post.status,
                post.timestamp,
                post.hrly_rate
            FROM TutorPosts post
            JOIN RegisteredUsers user ON post.user_id = user.user_id
            JOIN Subjects subject ON post.subject_id = subject.subject_id
            WHERE status = 'active'
            ORDER BY post.timestamp DESC
            LIMIT 3
        `;

        const [rows] = await db.execute(sql);

        const recentTutors = rows.map(tutor => {
            let courses = tutor.courses ? tutor.courses.split(',').map(course => course.trim()) : [];
            let profilepic = tutor.profilepic
                ? `data:image/jpeg;base64,${Buffer.from(tutor.profilepic).toString('base64')}`
                : '/images/default-profile.jpg';
            let cv = tutor.cv
                ? `data:application/pdf;base64,${Buffer.from(tutor.cv).toString('base64')}`
                : null;

            return {
                ...tutor,
                courses,
                profilepic,
                cv
            };
        });

        res.render('index', {
            header_name: 'Welcome to GatorAid!',
            title: 'GatorAid',
            css: ['index.css', 'search.css'],
            recentTutors
        });
    } catch (error) {
        console.error("Error fetching recent tutors:", error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'An error occurred while fetching recent tutors. Please try again later.'
        });
    }
});

module.exports = router;
