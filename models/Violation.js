const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const violationSchema = new Schema({
    authorid: {
        type:Number,
        required: true
    },
    case_date: {
        type: String,
        required: true
    },
    case_desc: {
        type: String,
        required: true
    },
    case_status: {
        type: String,
        enum: ['cleared','pending'],
        default: ['cleared']
    },
    case_title: {
        type: String,
        required: true
    },
    case_id: {
        type: Number,
        required: true
    }
})
violationSchema.index({ userID: 1 });

module.exports = mongoose.model('Violation', violationSchema);