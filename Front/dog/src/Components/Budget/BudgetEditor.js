import React from 'react'
import BudgetButtons from './BudgetButtons';
import BudgetMonthly from './BudgetMonthly';
import BudgetIncomes from './BudgetIncomes';
import BudgetExpense from './BudgetExpense';

const BudgetEditor = React.memo((props) => {
    
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
}, (prevProps, nextProps) => {
    if (prevProps.budgetEdit !== nextProps.budgetEdit) {
        return false;
    } else if (prevProps.incomeEdit !== nextProps.incomeEdit) {
        return false;
    } else if (prevProps.expenseEdit !== nextProps.expenseEdit) {
        return false;
    }
    return true;
})

export default BudgetEditor
