const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/income-controller');
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
    

], incomeController.createIncome)


module.exports = router;