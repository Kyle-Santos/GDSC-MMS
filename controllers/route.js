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
            title: "Landing",
        });
            
    });

    // get officer page
    server.get('/officer', (req, res) => {
        res.render('officer', { 
            layout: 'index',
            title: "Officer",
            'officer': officer[0],
            isForOfficer: true,
        });
            
    });
}

module.exports.add = add;