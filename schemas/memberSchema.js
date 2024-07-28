const mongoose =  require('mongoose');

const memberSchema = new mongoose.Schema({
    contact: { type: String }, 
    email: {type: String},
    password: { type: String}, 
    firstname: {type: String},
    lastname: {type: String},
    position: {type: String},
    profilepicture: {type:String, default:""},
    studentid: {type: Number},
    violations: [{type: Number}]
 },{ versionKey: false });

 const memberModel = mongoose.model('member',memberSchema, 'members');
 module.exports = memberModel; 