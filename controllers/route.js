const path = require('path');
const fs = require('fs');
const { off } = require('process');

// Read and parse the JSON file
const rawData = fs.readFileSync(path.join(__dirname, '../data/officer.json'));
const officer = JSON.parse(rawData);

function add(server){
    server.get('/', (req, res) => {
        res.render('landing-page', { 
            layout: 'index',
            title: "Home",
        });
            
    });

    // get officer page (for officer accounts)
    server.get('/officer', (req, res) => {
        res.render('officer', { 
            layout: 'index',
            title: "Officer",
            'officer': officer[0],
            isForOfficer: true,
        });
            
    });

    // get events page (admin)
    server.get('/events', (req, res) => {
        res.render('events', { 
            layout: 'index',
            title: "Events",
            isEvents: true
        });
            
    });

    server.get('/members', (req,res) => {
        res.render('members', {
            layout: 'index',
            title: "Members",
            isMembers: true
        });
    });

    server.get('/login', (req,res) => {
        res.render('login', {
            layout: 'index',
            title: "Login",
            isLogin: true
        });
    });

}

module.exports.add = add;