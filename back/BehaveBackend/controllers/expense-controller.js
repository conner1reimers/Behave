const mongoose = require('mongoose');
const User = require('../models/user');
const Expense = require('../models/expense');
const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');

const createExpense = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(new HttpError('Invalid inputs passed...', 422))
    }

    const {title, description, month, ammount, creator} = req.body;

    const createdExpense = new Expense({
        title,
        description,
        month,
        ammount,
        creator
    });
    // Find a user to attatch to expense
    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError('Creating expense failed...', 500);
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
        await createdExpense.save({ session: sesh})
        user.expenses.push(createdExpense)
        await user.save({ session: sesh})
        await sesh.commitTransaction();

    } catch (err) {
        const error = new HttpError('Could not Expense', 404);
        return next(error);
    };

    res.status(201).json({expense: createdExpense})
}

const deleteGroup = async (req, res, next) => {
    const {title, creator} = req.body;

    let user;
    try {   
        user = await User.findById(creator).populate('expenses');
    } catch (err) {
        const error = new HttpError('Could not find user', 404);
        return next(error);
    };

    if (!user) {
        const error = new HttpError('Could not find a user', 404);
        return next(error);
    }
    
    const expensesToDelete = user.expenses.filter((el) => {
        return el.title === title
    })

    const expensesToDeleteIds = expensesToDelete.map((el) => {
        return el._id
    })

    if (user.expenses) {
        if (user.expenses.length >= 1) {
            let respon
            try {   
                // const sess = await mongoose.startSession();
                // sess.startTransaction();
                respon = await Expense.deleteMany({ _id: {$in: expensesToDeleteIds} });

                let newExpenses = []

                for (i=0; i < expensesToDeleteIds.length; i++) {
                    id = expensesToDeleteIds[i];
            
                    let findem = user.expenses.filter((el) => {
                        return el._id === id;
                    })
                    if (findem) {
                        if (findem.length > 0) {
                            let now = findem.reduce((cur, acc) => {return cur})
                            user.expenses.pull(now)
                        }
                    }
                }

                let filtered = user.expenses.filter((el) => {
                    return newExpenses.indexOf(el) === -1
                })

                await User.updateMany(
                    {
                        _id: creator
                    }, {
                        $set: {
                            'expenses': filtered
                        }
                    }
                )
                // await user.expenses.save({session: sess})                
                // await sess.commitTransaction();
                res.json({deleted: respon})
            } catch (err) {
                const error = new HttpError('Could not find z user', 404);
                return next(error);
            };
            
        }
    }
}

const deleteSingleExpense = async (req, res, next) => {
    const expenseId = req.params.eid;

    let expense;
    try {
        expense = await Expense.findById(expenseId).populate('creator');
    } catch (error) {
        error = new HttpError('Couldnt delete... hmmm', 500);
        return next(error);
    }

    if(!expense) {
        error = new HttpError('Couldnt delete... hmmm', 500);
        return next(error);
    }


    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await expense.remove({session: sess});
        expense.creator.expenses.pull(expense);
        await expense.creator.save({session: sess});
        await sess.commitTransaction();

    } catch (error) {
        error = new HttpError('Couldnt delete... hmmm', 500);
        return next(error);
    }
    res.json({deleted: expense})

}

const updateExpense = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid ammount passed', 422));
    };

    const expenseId = req.params.eid;
    const {ammount} = req.body;


    try {
        expense = await Expense.findById(expenseId);
    } catch (err) {
        const error = new HttpError('Could not find the expense', 500);
        return next(error)
    };

    expense.ammount = ammount;

    try {
        await expense.save();
    } catch (error) {
        error = new HttpError('Somethinddg went wrong, couldnt update for some reason hmmmm.....', 500);
        return next(error);
    }

    res.status(200).json({expense: expense.toObject({getters: true})})
}


exports.createExpense = createExpense;
exports.deleteGroup = deleteGroup;
exports.deleteSingleExpense = deleteSingleExpense;
exports.updateExpense = updateExpense;