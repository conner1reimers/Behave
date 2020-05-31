const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema({
    task: { type: String, required: true},
    urgency: { type: String, required: true},
    month: { type: String, required: true},
    time: { type: String, required: true},
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User'}
})

module.exports = mongoose.model('Todo', todoSchema)