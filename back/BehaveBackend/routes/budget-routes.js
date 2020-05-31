const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget-controller');
const {check} = require('express-validator');

router.get('/:userId/', budgetController.getBudgets)


router.post('/',
[
    check('month')
        .isLength({min: 6, max: 6}),
    check('ammount')
        .isCurrency()
    

], budgetController.createBudget)


module.exports = router;