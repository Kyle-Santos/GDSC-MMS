const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const memberSchema = new Schema({
    studentId: {
        type: Number,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: ""
    },
    // CONFIRM: is contact number optional?
    contact:{
        type: String,
        default: null
    },
    position:{
        type: String,
        enum: ['Admin', 'Officer', 'Member'],
        default: 'Member',
        required: true
    },
    profilepicture:{
        type: String,
        default: null
    },
    violations:{ // array of violation numbers
        type: [Number]
    }

},{ versionKey: false });
memberSchema.index({ userID: 1 });

module.exports = mongoose.model('Member',memberSchema);; 