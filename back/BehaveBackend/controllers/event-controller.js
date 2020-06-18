const mongoose = require('mongoose');
const User = require('../models/user');
const Event = require('../models/events');
const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');

//  NEED EVENTS IN THIS FORM


// let events = {
//     52020: {
//         1: {
//             title: 'Go to the store'
//             }
//     },
//     62020: {
//         2: {
//             title: 'Go to the store'
//             },
//         6: {
//             title: 'Help'
//         }
//     },
//     102020: {
//         2: {
//             title: 'Go to the store'
//             },
//         6: {
//             title: 'Help'
//         }
//     },
// }

const getEvents = async (req, res, next) => {
    const userId = req.params.userId;

    const chosenMonthYear = parseInt(req.params.cmy);
    let events = {}

    let user;
    try {
        user = await User.findById(userId).populate('events')
    } catch (err) {
        const error = new HttpError('Finding events failed... Could not find the user', 500);
        return next(error);
    }

    if (user.events) {
        if (user.events.length > 0) {
            if(chosenMonthYear) {
                events[chosenMonthYear] = {}
            } else {
                const error = new HttpError('Theres no month to get events for...', 500);
                return next(error);
            }

            let filteredEventsByMonth = user.events.filter((el) => {

                return el.monthYear === chosenMonthYear
            })
            if (filteredEventsByMonth.length > 0 ) {
                filteredEventsByMonth.map((el) => {
                    if (events[chosenMonthYear][el.day]) {
                        events[chosenMonthYear][el.day].push({
                            title: el.title,
                            category: el.category,
                            time: el.time,
                            description: el.description,
                            location: el.location,

                        })
                    } else {
                        events[chosenMonthYear][el.day] = [{
                            title: el.title,
                            category: el.category,
                            time: el.time,
                            description: el.description,
                            location: el.location,
                        }]
                    }
                    
                });
                res.status(201).json({events})

            } else {
                res.status(201).json({events: {}})
            }
            
        } else {
            res.status(201).json({events: {}})

        }    
    } else {
        res.status(201).json({events: {}})

    }    

    
}

const createEvent = async (req, res, next) => {
    console.log('going..')

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(new HttpError('Invalid inputs passed...', 422))
    };

    const {monthYear, day, title, category, time, description, location, creator} = req.body;

    const createdEvent = new Event({
        monthYear,
        day,
        title,
        category,
        creator,
        time,
        description, 
        location
    });

    let user;

    try {
        user = await User.findById(creator);

    } catch (err) {
        const error = new HttpError('Creating event failed while finding user...', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find the user', 404);
        return next(error)
    }


    try {
        const sesh = await mongoose.startSession();
        sesh.startTransaction()
        await createdEvent.save({ session: sesh})
        user.events.push(createdEvent)
        await user.save({ session: sesh})
        await sesh.commitTransaction();

    } catch (err) {
        const error = new HttpError('Error saving your event to the database...', 404);
        return next(error);
    };

    res.status(201).json({event: createdEvent})
}



exports.createEvent = createEvent;
exports.getEvents = getEvents;