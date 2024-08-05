const path = require('path');
const fs = require('fs');
const { off } = require('process');
const eventController = require('../controllers/eventController');

function errorFn(err) {
    console.log("Error found");
    console.error(err);
  }

//adding schemas
const Member = require("../models/Member");
const Model = require("../models/Event");

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
    server.get('/officer', (req, res) => {
        res.render('officer', { 
            layout: 'index',
            title: "Officer",
            'officer': officer[0],
            isForOfficer: true,
        });
            
    });

    // get events page (admin)
    server.get('/events', async (req, res) => {
        Model.find().lean().then(function(events){

            res.render('events',{
                layout: 'index',
                title: "Events",
                isEvents: true,
                events: events
            })
        }).catch(errorFn);
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

    server.get('/event/:id/attendance', async (req, res) => {
        try {
            const attendance = await eventController.getEventAttendance(req.params.id);
            res.json(attendance);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching event attendance' });
        }
    });

    server.get('/members', (req,res) => {
        Member.find().lean().then(function(members){

            let positions = members.map(member => member.position);
            let uniquePositions = [...new Set(positions)];

            let idNos = members.map(member => {
                return member.studentId.toString().substring(0, 3);
            });
            let uniqueId = [...new Set(idNos)];
            let selectedMember = members[0];
            res.render('members', {
                layout: 'index',
                title: "Members",
                isMembers: true,
                'member-list': members,
                'selected-member': selectedMember,
                'positions': uniquePositions,
                'idnumbers': uniqueId
            });
        }).catch(errorFn);
    });

    server.get('/member/:studentid', async (req,res) => {
        try {
            await Member.findOne({ studentId: req.params.studentid }).lean().then(function(member){
                if (member) {
                    res.json(member);
                } else {
                    res.status(404).json({ message: 'Member not found' });
                }
            }).catch(errorFn);
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching member details' });
        }
    });

    //ADDING USERS
    server.post('/add-member', async function(req, res){
        console.log(req.body);
        const {position, firstname, lastname, contact, email, studentId, password} = req.body;
        const newMember = new Member({
            position,
            firstname, 
            lastname,
            contact,
            email,
            studentId,
            password,
            profilepicture: "",
            violations: []
        });
        await newMember.save().then(function(){
            console.log('Added Member Successfully!', newMember);
            res.redirect('/members');
        });
    });

    //DELETING USERS
    server.post('/delete-member', async function(req,res){
        const{ studentid } = req.body;
        try {
            await Member.findOneAndDelete({ studentId });
            console.log('Deleted Member');
            res.redirect('/members');
        } catch (error) {
            errorFn(error);
            res.status(500).json({ message: 'Error deleting member' });
        }
    });

    server.get('/login', (req,res) => {
        res.render('login', {
            layout: 'index',
            title: "Login",
            isLogin: true
        });
    });

    //SEARCHING USERS
    server.get('/search-members', async (req, res) => {
        const { name, id, position, status } = req.query;
        let filter = {};
    
        if (name) {
            filter.$or = [
                { firstname: new RegExp(name, 'i') },
                { lastname: new RegExp(name, 'i') }
            ];
        }
        if (id && id !== '0') {
            filter.studentid = id;
        }
        if (position && position !== 'position') {
            filter.position = position;
        }
        if (status && status !== 'status') {
            // Add status filter logic here if applicable
        }
    
        try {
            const members = await memberModel.find(filter).lean();
            res.json(members);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching members' });
        }
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