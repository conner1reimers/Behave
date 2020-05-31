const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const incomeSchema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: false},
    month: { type: String, required: true},
    ammount: { type: Number, required: true},
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User'}
})

module.exports = mongoose.model('Income', incomeSchema)