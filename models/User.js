const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    studentID: {
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
        type: Number,
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
    }

})
userSchema.index({ userID: 1 });

module.exports = mongoose.model('User', userSchema);