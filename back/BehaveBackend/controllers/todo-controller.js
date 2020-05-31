const mongoose = require('mongoose');
const User = require('../models/user');
const Todo = require('../models/todo');
const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');

const getTodo = async (req, res, next) => {
    const userId = req.params.uid;
    let user;

    if (!userId) {
        next(new HttpError('Could not fetch todos: Finding user error', 422));
    };

    try {
        user = await User.findById(userId).populate('todos');
    } catch (err) {
        const error = new HttpError('finding todo failed', 500);
        return next(error);
    };

    if (!user) {
        next(new HttpError('Could not fetch todos: User could not be found', 422));
    };
    if (user.todos) {
        if (user.todos.length === 0) {
            res.json({todos: [{}]});
        } else {
            res.json({todos: user.todos.map(todo => todo.toObject({ getters: true}))})
        }
    }  else {
        res.json({todos: [{}]});
    }
}

const createTodo = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(new HttpError('Invalid inputs passed...', 422))
    }

    const {task, urgency, time, creator, month} = req.body;

    const createdTodo = new Todo({
        task,
        urgency,
        month,
        time,
        creator
    });

    let user;
    try {
        user = await User.findById(creator)
    } catch(err) {
        const error = new HttpError('Could not find the user to create todo', 500);
        return next(error);
    }
    if(!user) {
        const error = new HttpError('Couldnt find the user to create todo', 500);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdTodo.save({session: sess});
        user.todos.push(createdTodo);
        await user.save({session: sess});
        await sess.commitTransaction();

    } catch(err) {
        const error = new HttpError('saving todo failed', 500);
        return next(error);
    };

    res.status(201).json({todo: createdTodo})
}


exports.createTodo = createTodo;
exports.getTodo = getTodo;