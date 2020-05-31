const HttpError = require('../models/http-error');
const User = require('../models/user');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const signUp = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const err = new HttpError('Invalid inputs... check your signup info', 500)
        return next(err)
    }

    const { email, password } = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({email})
    } catch(error) {
        const err = new HttpError('Error occurred signing up...', 500)
        return next(err)
    }
    if (existingUser) {
        const err = new HttpError('This user already exists... Go login!', 500)
        return next(err)
    }

    let hashedPass;
    try {
        hashedPass = await bcrypt.hash(password, 12)
    } catch(error) {
        const err = new HttpError('pass hash failed', 500)
        return next(err)
    }

    const createdUser = new User({
        email,
        password: hashedPass
    });

    try {
        await createdUser.save()
    } catch(error) {
        const err = new HttpError('Error occurred signing up...', 500)
        return next(err)
    }

    let token;
    try {
        token = jwt.sign(
            {userId: createdUser.id, email: createdUser.email},
            'dontUshare',
            {expiresIn: '1h'})
    } catch(error) {
        const err = new HttpError('Token creation failed...', 500)
        return next(err)
    }

    res.status(201).json({token: token, email: createdUser.email, userId: createdUser.id})



}
const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email})
    } catch {
        const err = new HttpError('Invalid inputs... check your signup info', 500)
        return next(err)
    }

    if(!existingUser) {
        const err = new HttpError('Couldnt find a user with that email... Try again', 500)
        return next(err)
    }

    let isValidPass = false;
    
    try {
        isValidPass = await bcrypt.compare(password, existingUser.password)

    } catch(err){
        const error = new HttpError('Invalid email/password.. failed', 401);
        return next(error);
    }

    if(!isValidPass) {
        const err = new HttpError('Incorrect password... Try again??', 500)
        return next(err)
    }

    let token;
    try {
        token = jwt.sign(
            {userId: existingUser.id, email: existingUser.email},
            'dontUshare',
            {expiresIn: '1h'})
    } catch(err) {
        const error = new HttpError('Signing up failed. idk what went wrong', 500)
        return next(error)
    }

    res.json({message: 'Logged In!', token: token, userId: existingUser.id, email: existingUser.email})
}


exports.signUp = signUp
exports.login = login