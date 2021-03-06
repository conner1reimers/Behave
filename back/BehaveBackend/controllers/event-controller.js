const mongoose = require('mongoose');
const User = require('../models/user');
const Event = require('../models/events');
const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');
const user = require('../models/user');

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
                            id: el._id,
                            day: el.day

                        })
                    } else {
                        events[chosenMonthYear][el.day] = [{
                            title: el.title,
                            category: el.category,
                            time: el.time,
                            description: el.description,
                            location: el.location,
                            id: el._id,
                            day: el.day

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
        sesh.startTransaction();
        await createdEvent.save({ session: sesh});
        user.events.push(createdEvent);
        await user.save({ session: sesh});
        await sesh.commitTransaction();

    } catch (err) {
        const error = new HttpError('Error saving your event to the database...', 404);
        return next(error);
    };

    res.status(201).json({event: createdEvent});
}

const getFirstEvent = async (req, res, next) => {
    const userId = req.params.userId;

    let userEvent;
    if (!userId) {
        const error = new HttpError('Finding user failed...', 500);
        return next(error);
    };

    let user;
    try {
        user = await User.findById(userId).populate('events')
    } catch (err) {
        const error = new HttpError('Finding user events failed...', 500);
        return next(error);
    };
    if (!user) {
        const error = new HttpError('Finding user failed...', 500);
        return next(error);
    };



    if (!user.events) {
        userEvent = {};
    } else if (user.events.length < 1) {
        userEvent = {};
    };

    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let currentDay = today.getDate();
    let curDate = parseInt(`${currentMonth}${currentYear}`);


    console.log(currentDay)
    let filtered = user.events.filter((el) => {return (el.monthYear === curDate && el.day >= currentDay)}).sort((a,b) => {return a.day - b.day})
    if (filtered.length >= 1) {
        userEvent = filtered[0]
    } else {
        let newDate = parseInt(`${currentMonth + 1}${currentYear}`);
        let newFiltered = user.events.filter((el) => {return el.monthYear === newDate}).sort((a,b) => {return a.day - b.day})
        if (newFiltered.length >= 1) {
            userEvent = filtered[0]
        } else {
            userEvent = {}
        }
    }

    res.status(201).json({event: userEvent});
}

const updateEvent = async (req, res, next) => {
    const { title, description, time, location} = req.body;
    const eventId = req.params.eventId;

    try {
        event = await Event.findById(eventId);
    } catch (err) {
        const error = new HttpError('Error while finding event in database..');
        return next(error);
    };

    event.title = (title && title!=='') ? title : event.title;
    event.description = (description && description!=='') ? description : event.description;
    event.time = (time && time!=='') ? time : event.time;
    event.location = (location && location!=='') ? location : event.location;


    try {

        await event.save();
    } catch (err) {
        const error = new HttpError('Error while saving event..');
        return next(error);
    };

    res.status(200).json({event: event.toObject({ getters: true})});

}

const deleteEvent = async (req, res, next) => {
    const eventId = req.params.eventId;
    let event;

    try {
        event = await Event.findById(eventId).populate('creator');
    } catch (error) {
        error = new HttpError('Couldnt delete...', 500);
        return next(error);
    }

    if (!event) {
        const error = new HttpError('could not find event for this id... ', 404)
        return next(error);
    };

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await event.remove({session: sess});
        event.creator.events.pull(event);
        await event.creator.save({session: sess});       
        await sess.commitTransaction();

    } catch (error) {
        error = new HttpError('Couldnt delete wow', 500);
        return next(error);
    }
    res.status(200).json({message: 'Deleted Event.'})

}

exports.createEvent = createEvent;
exports.getEvents = getEvents;
exports.getFirstEvent = getFirstEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;