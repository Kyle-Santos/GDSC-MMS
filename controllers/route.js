const path = require('path');
const fs = require('fs');
const { off } = require('process');
const eventController = require('../controllers/eventController');

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

    // Route to handle form submission
    server.post('/submit-event', eventController.createEvent);
    
    // get officer page (for officer accounts)
    server.get('/officers', (req, res) => {
        res.render('officers', { 
            layout: 'index',
            title: "Officers",
            'officers': officer[0],
            isForOfficer: true,
        });
            
    });

    // get events page (admin)
    server.get('/events', async (req, res) => {
        try {
            const events = await eventController.readAllEvents();
    
            res.render('events', { 
                layout: 'index',
                title: "Events",
                isEvents: true,
                events: events
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching events' });
        }
    });

    server.get('/event/:id', async (req, res) => {
        try {
            const event = await eventController.readEvent(req.params.id);
            res.json(event);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching event details' });
        }
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
    // FOR TESTING ONLY
    server.get('/dbtester', (req, res) => {
        res.render('dbtester', {
            layout: 'index',
            title: "DBTester",
        });
    });
    

}

module.exports.add = add;