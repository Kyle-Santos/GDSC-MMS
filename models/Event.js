const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventID: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    attendeeCount: {
        type: Number,
        default: 0
    },
    // CONFIRM: can an event not have a project head when it is created? i.e. fundraising event with no assigned head yet
    projectHeadID: {
        type: Number,
        required: true
    },

})
eventSchema.index({ userID: 1 });

module.exports = mongoose.model('Event', eventSchema);