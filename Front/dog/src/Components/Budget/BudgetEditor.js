import React from 'react'
import BudgetButtons from './BudgetButtons';
import BudgetMonthly from './BudgetMonthly';
import BudgetIncomes from './BudgetIncomes';
import BudgetExpense from './BudgetExpense';

const BudgetEditor = (props) => {
    
    let budgetModal;

    if (!props.budgetEdit && !props.incomeEdit && !props.expenseEdit) {
        
        budgetModal = (<BudgetButtons 
                            editBudgetToggle={props.editBudgetToggle}
                            editIncomeToggle={props.editIncomeToggle}
                            editExpenseToggle={props.editExpenseToggle}
                        />)

    } else if (props.budgetEdit && !props.incomeEdit && !props.expenseEdit) {
        budgetModal = (
            <BudgetMonthly 
                justSubmitted={props.justSubmitted}  
                userBudget={props.existingUserBudget} 
                passData={props.passData} 
            />)

    } else if (!props.budgetEdit && props.incomeEdit && !props.expenseEdit) {
        budgetModal = (
        <BudgetIncomes 
            justSubmitted={props.justSubmitted} 
            passData={props.passData}
        />)

    } else if (!props.budgetEdit && !props.incomeEdit && props.expenseEdit) {
        budgetModal = (
            <BudgetExpense 
                justSubmitted={props.justSubmitted} 
                passData={props.passData}
            />)
    }


    return (
        <div className="budget-editor">
            {budgetModal}
        </div>
    )
}

export default BudgetEditor
