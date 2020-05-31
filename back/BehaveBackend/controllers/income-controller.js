const mongoose = require('mongoose');
const User = require('../models/user');
const Income = require('../models/income');
const HttpError = require('../models/http-error');


const createIncome = async (req, res, next) => {
    // const errors = 

    const {title, month, description, ammount, creator} = req.body;

    const createdIncome = new Income({
        title,
        description,
        month,
        ammount,
        creator
    });
    // Find a user to attatch to Income
    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError('Creating Income failed...', 500);
        return next(error);
    }
    // Make sure there was a user
    if (!user) {
        const error = new HttpError('Could not find the user', 404);
        return next(error)
    }
    
    try {
        const sesh = await mongoose.startSession();
        sesh.startTransaction()
        await createdIncome.save({ session: sesh})
        user.incomes.push(createdIncome)
        await user.save({ session: sesh})
        await sesh.commitTransaction();

    } catch (err) {
        const error = new HttpError('Could not Income', 404);
        return next(error);
    };

    res.status(201).json({income: createdIncome})
}


exports.createIncome = createIncome