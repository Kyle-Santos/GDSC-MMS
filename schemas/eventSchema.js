const mongoose =  require('mongoose');

const eventSchema = new mongoose.Schema({
    eventid:{Number},
    name: {String},
    date: {String},
    venue: {String},
    time: {String},
    attendeeCount: {String},
    projectHeadID: {String},
    __v:{Number}
 },{ versionKey: false });

 const eventModel = mongoose.model('event', eventSchema, 'events');
 module.exports = eventModel; 