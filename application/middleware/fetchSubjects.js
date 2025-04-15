const db = require("../conf/database");

module.exports = {
    fetchSubjects: async (req, res, next) => {
        try {
            const [subjects] = await db.query('SELECT * FROM Subjects');
            res.locals.subjects = subjects;

            next();
        } catch (err) {
            console.error('Error fetching subjects:', err);
            return next(err);
        }
    }
};
