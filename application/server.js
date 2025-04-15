/**
 *  Authors: n-ndo
 */

require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sessions = require('express-session');
const mysqlStore = require('express-mysql-session')(sessions);
const { engine } = require('express-handlebars');
const { fetchSubjects } = require('./middleware/fetchSubjects');
const { isAuthenticated } = require('./middleware/authMiddleware');

// Route imports
const indexRouter = require('./routes');
const aboutRouter = require('./routes/about-page/about');
const searchRouter = require('./routes/search');
const registrationRouter = require('./routes/registration_page');
const dashboardRouter = require('./routes/dashBoard');
const tutorAppRouter = require('./routes/tutor_app');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');

// Initialize the server
const server = express();

// Handlebars setup
server.engine(
    "hbs",
    engine({
        layoutsDir: path.join(__dirname, "views/layouts"),
        partialsDir: path.join(__dirname, "views/partials"),
        extname: ".hbs",
        defaultLayout: "layout",
        helpers: {
            equals: function (a, b) {
                return a?.trim().toLowerCase() === b?.trim().toLowerCase();
            }
        },
    })
);
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'hbs');

// Session store setup
const sessionStore = new mysqlStore({/*default options*/}, require('./conf/database'));

// Middleware
server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

server.use(
    sessions({
        secret: "csc 648 secret",
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            httpOnly: true,
            secure: false,
        },
    })
);

// Middleware to set `res.locals.user` for session propagation
server.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Fetch subjects middleware
server.use(fetchSubjects);

// Route handlers
server.use('/', indexRouter);
server.use('/about-us', aboutRouter);
server.use('/search', searchRouter);
server.use('/registration_page', registrationRouter);
server.use('/dashboard', dashboardRouter);
server.use('/tutor-app', tutorAppRouter);
server.use('/login', loginRouter);
server.use('/logout', logoutRouter);

// Handle favicon.ico requests
server.get('/favicon.ico', (req, res) => {
    res.sendStatus(204); // No content for favicon requests
});

// Debugging unmatched routes
server.use((req, res, next) => {
    console.log(`Unmatched request: ${req.method} ${req.originalUrl}`);
    next();
});

// 404 error handler
server.use(function (req, res, next) {
    console.error(`404 Error: Route not found - ${req.method} ${req.originalUrl}`);
    res.status(404).render('404', { title: 'Page Not Found' }); // Use a custom 404 page
});

// General error handler
server.use(function (err, req, res, next) {
    console.error("Error occurred:", err.stack || err); // Log stack trace for debugging
    res.status(err.status || 500).render('error', {
        title: 'Error',
        message: err.message || 'An unexpected error occurred.',
    });
});

module.exports = server;
