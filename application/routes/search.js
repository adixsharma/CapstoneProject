const express = require('express');
const router = express.Router();
const db = require('../conf/database');

// Route to fetch and display tutors
router.get('/', async function (req, res, next) {
    const { subject, search } = req.query;

    try {
        let params = [];
        let sql = `
            SELECT
                post.tutor_id,
                user.first_name,
                user.last_name,
                subject.subject_name,
                post.title,
                post.courses,
                post.profilepic,
                post.cv,
                post.video,
                post.video_description,
                post.bio,
                post.hrly_rate
            FROM TutorPosts post
            JOIN RegisteredUsers user ON post.user_id = user.user_id
            JOIN Subjects subject ON post.subject_id = subject.subject_id
            WHERE post.status = 'active'
        `;

        // Add filters for subject and search terms
        if (subject) {
            sql += ` AND subject.subject_name = ?`;
            params.push(subject);
        }

        if (search) {
            const searchTerms = search.split(' ').filter(Boolean).map(term => `%${term}%`);
            const searchSQL = searchTerms.map(() =>
                `CONCAT_WS(' ', subject.subject_name, post.hrly_rate, user.first_name, user.last_name, post.courses, post.bio, post.video_description) LIKE ?`
            ).join(" OR ");
            sql += ` AND (${searchSQL})`;
            params.push(...searchTerms);
        }

        const [rows] = await db.execute(sql, params);

        // Process results
        res.locals.results = rows.map(tutor => ({
            ...tutor,
            courses: tutor.courses ? tutor.courses.split(',').map(course => course.trim()) : [],
            profilepic: tutor.profilepic ? `data:image/jpeg;base64,${Buffer.from(tutor.profilepic).toString('base64')}` : '',
            cv: tutor.cv ? `data:application/pdf;base64,${Buffer.from(tutor.cv).toString('base64')}` : '',
            videoUrl: tutor.video ? `/search/video/${tutor.tutor_id}` : null,
        }));

        res.locals.selectedSubject = subject || '';

        res.render('search', {
            header_name: 'Available Tutors',
            css: ['search.css'],
            js: ['messagePopUp.js', 'sort.js', 'videoPopUp.js'],
            num_tutors: rows.length,
            subjects: res.locals.subjects,
            selectedSubject: res.locals.selectedSubject
        });
    } catch (error) {
        console.error('Error fetching tutor posts:', error);
        next(error);
    }
});

// New Route to Serve Video
router.get('/video/:tutor_id', async (req, res, next) => {
    const tutor_id = req.params.tutor_id;

    try {
        // Fetch the video from the database
        const [rows] = await db.execute('SELECT video FROM TutorPosts WHERE tutor_id = ?', [tutor_id]);

        if (rows.length === 0 || !rows[0].video) {
            return res.status(404).send('Video not found');
        }

        const videoBuffer = rows[0].video;
        const videoSize = videoBuffer.length;

        const range = req.headers.range;
        if (!range) {
            // No range header present, send the entire video
            res.writeHead(200, {
                'Content-Length': videoSize,
                'Content-Type': 'video/mp4',
            });
            return res.end(videoBuffer);
        }

        // Parse Range
        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        const contentLength = end - start + 1;
        const headers = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, headers);
        res.end(videoBuffer.slice(start, end + 1));
    } catch (error) {
        console.error('Error serving video:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
