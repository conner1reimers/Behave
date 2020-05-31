const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense-controller');
const {check} = require('express-validator');

// router.get('/:uid', budgetController.getBudgets)

router.post('/',
    [
        check('month')
            .isLength({min: 6, max: 6}),
        check('ammount')
            .isCurrency(),
        check('title')
            .not()
            .isEmpty(),
        

    ],
    expenseController.createExpense)

router.delete('/deletegroup', expenseController.deleteGroup)


module.exports = router;