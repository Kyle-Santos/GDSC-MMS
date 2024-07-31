const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const memberSchema = new Schema({
    studentid: {
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
        required: true
    },
    // CONFIRM: is contact number optional?
    contactnum:{
        type: String,
        default: null
    },
    position:{
        type: String,
        enum: ['Admin', 'Officer', 'Student'],
        default: 'Student',
        required: true
    },
    profile_picture_url:{
        type: String,
        default: null
    },
    violations:{ // array of violation numbers
        type: [Number]
    }

},{ versionKey: false });
userSchema.index({ userID: 1 });

const Member = mongoose.model('Member',memberSchema);
module.exports = Member; 