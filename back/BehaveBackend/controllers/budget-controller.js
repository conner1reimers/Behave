const mongoose = require('mongoose');
const User = require('../models/user');
const Budget = require('../models/budget');
const HttpError = require('../models/http-error');
const Income = require('../models/income');
const Expense = require('../models/expense')



const getBudgets = async (req, res, next) => {
    const userId = req.params.userId;

    let userBudget;
    let user;

    let existingBudget = [];
    let existingIncomes = [];
    let existingExpenses = [];

    let budget;
    let expenses;
    let incomes;
    let allBudgets;
    let allExpenses;
    let allIncomes;


    try {
        user = await User.findById(userId).populate('budgets').populate('incomes').populate('expenses')
    } catch (err) {
        const error = new HttpError('Finding budget failed...', 500);
        return next(error);
    };

    const date = new Date()
    let month = (date.getMonth() + 1).toString()
    let year = date.getFullYear().toString();
            
    if (month.length <= 1) {
        month = '0' + month
    }
    const curMonth = month + year;

    if (user.budgets) {
        if (user.budgets.length < 1) {
            budget = "not found"

        } else {
            existingBudget = user.budgets.filter((budget) => {
                return budget.month === curMonth
            })
        }
    }
    if (user.incomes) {
        if (user.incomes.length < 1) {
            existingIncomes = [{}]

        } else {
            existingIncomes = user.incomes.filter((income) => {
                return income.month === curMonth
            })
        }
    }
    if (user.expenses) {
        if (user.expenses.length < 1) {
            existingExpenses = [{}]

        } else {
            existingExpenses = user.expenses.filter((expense) => {
                return expense.month === curMonth
            })
        }
    }
    
    
    if (existingBudget.length >= 1) {
        let budgetId = existingBudget[0].id;
        
        try {
            budget = await Budget.findById(budgetId);
            allBudgets = user.budgets.map((el) => {return el});
            allExpenses = user.expenses.map((el) => {return el});
            allIncomes = user.incomes.map((el) => {return el})


        } catch (err) {
            const error = new HttpError('Fetching budget failed...', 500);
            return next(error);
        };
    }


    res.status(201).json({budget: budget, income: existingIncomes, expense: existingExpenses, allBudgets, allExpenses, allIncomes})

            

}

const createBudget = async (req, res, next) => {
    // const errors = 

    const {month, ammount, creator} = req.body;

    const createdBudget = new Budget({
        month,
        ammount,
        creator
    });

    
    let user;
    try {
        user = await User.findById(creator).populate('budgets');
    } catch (err) {
        const error = new HttpError('Creating budget failed...', 500);
        return next(error);
    }
    // Make sure there was a user
    if (!user) {
        const error = new HttpError('Could not find the user', 404);
        return next(error)
    }
    // Find a user to attatch to budget
    let existingBudget;

    if (user.budgets) {
        const date = new Date()
        let month = (date.getMonth() + 1).toString()
        let year = date.getFullYear().toString();
        
        if (month.length <= 1) {
            month = '0' + month
        }
        const curMonth = month + year;

        existingBudget = user.budgets.filter((budget) => {
            return budget.month === curMonth
        })
    }

    if (existingBudget.length >= 1) {
        // deleteExistingBudget(existingBudget[0].id)
        const budgetId = existingBudget[0].id;
        let budget;

        try {
            budget = await Budget.findById(budgetId)
        } catch (err) {
            const error = new HttpError('update budget failed...', 500);
            return next(error);
        }
        budget.ammount = ammount;

        try {
            await budget.save();
        } catch (error) {
            error = new HttpError('Somethinddg went wrong, couldnt update for some reason hmmmm.....', 500);
            return next(error);
        }
        res.status(200).json({budget: budget.toObject({ getters: true})})
    } else {

        try {
            const sesh = await mongoose.startSession();
            sesh.startTransaction()
            await createdBudget.save({ session: sesh})
            user.budgets.push(createdBudget)
            await user.save({ session: sesh})
            await sesh.commitTransaction();
    
        } catch (err) {
            const error = new HttpError('Could not budget', 404);
            return next(error);
        };
    
        res.status(201).json({budget: createdBudget.toObject({ getters: true})})
    } 
}

const deleteBudget = async (req, res, next) => {
    const budgetId = req.body
}


exports.createBudget = createBudget
exports.deleteBudget = deleteBudget
exports.getBudgets = getBudgets