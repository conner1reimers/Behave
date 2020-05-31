import React from 'react'
import Potion from '../../lotties/EditBudgetIcons/Potion'
import ExpenseIcon from '../../lotties/EditBudgetIcons/ExpenseIcon'
import ExpenseIcon2 from '../../lotties/EditBudgetIcons/ExpenseIcon2'

//BILL MONEY STACK

const BudgetButtons = (props) => {
    return (
    <div className="budget-buttons">
        <Potion editBudgetToggle={props.editBudgetToggle}/>
        <ExpenseIcon editIncomeToggle={props.editIncomeToggle} />
        <ExpenseIcon2 editExpenseToggle={props.editExpenseToggle} />
    </div>)
}

export default BudgetButtons
