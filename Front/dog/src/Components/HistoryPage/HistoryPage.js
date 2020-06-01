import React from 'react'
import HistoryLeft from './HistoryComponents/HistoryLeft'
import HistoryMiddle from './HistoryComponents/HistoryMiddle'
const HistoryPage = (props) => {

    const expenses = props.budget.expense;
    const incomes = props.budget.income;
    const budgets = props.budget.budget;

    let mayBudget;
    let juneBudget;
    let julyBudget;

    let mayExpenses;
    let juneExpenses;
    let julyExpenses;

    let mayIncomes;
    let juneIncomes;
    let julyIncomes;


    if (budgets.length >= 1) {
        mayBudget = budgets.filter((el) => {
            return el.month === "052020"
        });
        juneBudget = budgets.filter((el) => {
            return el.month === "062020"
        });
        julyBudget = budgets.filter((el) => {
            return el.month === "072020"
        });


    }

    if (expenses.length >= 1) {
        mayExpenses = expenses.filter((el) => {
            return el.month === "052020"
        });

        juneExpenses = expenses.filter((el) => {
            return el.month === "062020"
        });

        julyExpenses = expenses.filter((el) => {
            return el.month === "072020"
        });
    }

    if (expenses.length >= 1) {
        mayIncomes = incomes.filter((el) => {
            return el.month === "052020"
        });

        juneIncomes = incomes.filter((el) => {
            return el.month === "062020"
        });

        julyIncomes = incomes.filter((el) => {
            return el.month === "072020"
        });
    }

    const userBudgets = {
        budgets: [mayBudget, juneBudget, julyBudget],
        expenses: [mayExpenses, juneExpenses]
    }




    console.log(mayBudget)

    return (
        <div className="history--first">
            <HistoryLeft userData={userBudgets}/>
            <HistoryMiddle />
        </div>
    )
}

export default HistoryPage
