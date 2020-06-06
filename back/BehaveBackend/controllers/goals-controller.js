const mongoose = require('mongoose');
const User = require('../models/user');
const Goals = require('../models/goals');
const HttpError = require('../models/http-error');


const getGoals = async (req, res, next) => {
    const userId = req.params.userId;

    let user;

    let goal;

    try {
        user = await User.findById(userId).populate('goals')
    } catch {
        const error = new HttpError('Finding goals failed...', 500);
        return next(error);
    }

    if (user.goals) {
        if (user.goals.length < 1) {
            goal = [{}]
        } else {
            goal = user.goals;
            
        }
    } else {
        goal = [{}]
    }
    res.status(201).json({goals: goal})
};

const chooseGoal = async (req, res, next) => {
    const { chosen, creator} = req.body;
    const goalId = req.params.gid

    let currentlyChosen;
    let goal;

    let user;

    try {
        user = await User.findById(creator).populate('goals')
    } catch (err) {
        const error = new HttpError('Creating budget failed...', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('No user found...', 500);
        return next(error);
    }

    if (user.goals) {
        if (user.goals.length > 0) {
            currentlyChosen = user.goals.filter((goal) => {
                return goal.chosen === true
            })
        } else {
            currentlyChosen = 'none'
        }
    } else {
        const error = new HttpError('Creating budget failed...', 500);
        return next(error);
    }



    try {
        goal = await Goals.findById(goalId)

    } catch (err) {
        const error = new HttpError('failed...', 500);
        return next(error);
    }


    if (currentlyChosen.length <= 2) {

        try {
            goal.chosen = !chosen
            await goal.save();
        } catch (err) {
            const error = new HttpError('changing goal failed...', 500);
            return next(error);
        }
    } else if (currentlyChosen.length === 3) {
        if (goal.chosen === true) {
            try {
                goal.chosen = false
                await goal.save();
            } catch (err) {
                const error = new HttpError('Making goal unchosen failed...', 500);
                return next(error);
            }


        } else {
            const error = new HttpError('You can only choose 3 goals.', 500);
            return next(error);
        }

    }


    res.status(200).json({goal: goal.toObject({ getters: true })});





}

const createGoal = async (req, res, next) => {
    const {title, chosen, creator} = req.body;

    const createdGoal = new Goals({
        title,
        chosen,
        creator
    });

    let user;

    try {
        user = await User.findById(creator).populate('goals')
    } catch (err) {
        const error = new HttpError('Creating budget failed...', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Creating budget failed...', 500);
        return next(error);
    }

    try {
        const sesh = await mongoose.startSession();
        sesh.startTransaction()
        await createdGoal.save({ session: sesh})
        user.goals.push(createdGoal)
        await user.save({ session: sesh})
        await sesh.commitTransaction();

    } catch (err) {
        const error = new HttpError('err saving', 404);
        return next(error);
    };

    res.status(201).json({goal: createdGoal.toObject({ getters: true})})

    


};


exports.getGoals = getGoals;
exports.createGoal = createGoal;
exports.chooseGoal = chooseGoal;