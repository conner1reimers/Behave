const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo-controller');
const {check} = require('express-validator');


// router.get('/:uid', budgetController.getBudgets)

router.get('/:uid', todoController.getTodo)

router.post('/',
[
    check('task')
        .not()
        .isEmpty(),
    check('urgency')
        .not()
        .isEmpty(),
    check('time')
        .not()
        .isEmpty(),
    

], todoController.createTodo)


module.exports = router;