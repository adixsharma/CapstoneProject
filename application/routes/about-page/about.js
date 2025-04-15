var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

const membersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'membersData.json'), 'utf-8'));

/* GET about page. */
router.get('/', function (req, res, next) {
    res.render('about_page', {
        title: 'About Us',
        header_name: 'About Us',
        css: ["aboutinfo.css"]
    });
});

/* GET member page */
router.get('/:member', function (req, res) {
    const member = req.params.member;
    const memberData = membersData[member];

    if (memberData) {
        res.render('about_page', {
            title: 'About Us',
            header_name: `${memberData.name}`,
            css: ["aboutinfo.css"],
            member: memberData
        });
    } else {
        return res.status(404).render('error', {
            message: 'Team member not found',
            error: {status: 404}
        });
    }
});

module.exports = router;