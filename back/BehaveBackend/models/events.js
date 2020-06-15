const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    day: { type: Number, required: true},
    monthYear: { type: Number, required: true},
    title: { type: String, required: true},
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User'}
})

module.exports = mongoose.model('Event', eventSchema)