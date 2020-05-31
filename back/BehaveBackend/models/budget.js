const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const budgetSchema = new Schema({
    month: { type: String, required: true},
    ammount: { type: Number, required: true},
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    
})

module.exports = mongoose.model('Budget', budgetSchema)