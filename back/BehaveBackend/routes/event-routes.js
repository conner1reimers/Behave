const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event-controller');
const {check} = require('express-validator');

router.get('/:userId/:cmy/', eventController.getEvents);

router.post('/',
    [
        check('monthYear')
            .not()
            .isEmpty(),
        check('day')
            .not()
            .isEmpty(),
        check('title')
            .not()
            .isEmpty(),
        

    ],
    eventController.createEvent);

router.patch('/:eventId/',
    eventController.updateEvent);

router.get('/:userId/', eventController.getFirstEvent);
router.delete('/:eventId/', eventController.deleteEvent);



module.exports = router;