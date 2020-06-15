const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6},
    budgets: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Budget'}],
    incomes: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Income'}],
    expenses: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Expense'}],
    goals: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Goals'}],
    todos: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Todo'}],
    events: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Event'}]



});

userSchema.plugin(uniquevalidator);

module.exports = mongoose.model('User', userSchema);