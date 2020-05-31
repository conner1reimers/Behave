const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/goals-controller');
const {check} = require('express-validator');

router.get('/:userId/', goalsController.getGoals);

router.post('/',
[
    check('title')
        .isLength({ min: 1 ,max: 20}),
    check('chosen')
        .notEmpty()
    

], goalsController.createGoal)

router.patch('/:gid', goalsController.chooseGoal)


module.exports = router;