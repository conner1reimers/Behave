import React, { useState } from 'react'
import HistoryLeft from './HistoryComponents/HistoryLeft'
import HistoryMiddle from './HistoryComponents/HistoryMiddle'

const HistoryPage = (props) => {

    const [monthSet, setMonthSet] = useState(null);

    const passData = (data) => {
        setMonthSet(data)
    } 

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
        if (mayBudget.length > 0) {
            mayBudget = mayBudget.reduce((el) =>{ return el})

        }
        juneBudget = budgets.filter((el) => {
            return el.month === "062020"
        });
        if (juneBudget.length > 0) {
            juneBudget = juneBudget.reduce((el) =>{ return el})

        }        

        julyBudget = budgets.filter((el) => {
            return el.month === "072020"
        });
        if (julyBudget.length > 0) {
            julyBudget = julyBudget.reduce((el) =>{ return el})

        }



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

    const userBudgets = [mayBudget, juneBudget, julyBudget];

    const userExpenses = {
        '052020': mayExpenses,
        '062020': juneExpenses,
        '072020': julyExpenses
    };
    const userIncomes = {
        mayIncomes,
        juneIncomes,
        julyIncomes
    };

    console.log(userExpenses)

    return (
        <div className="history--first">
            <HistoryLeft
                passData={passData} 
                budgets={userBudgets}
            />

            <HistoryMiddle 
                chosenMonth={monthSet}
                budgets={userBudgets}
                expenses={userExpenses}
                incomes={userIncomes}
            />
        </div>
    )
}

export default HistoryPage
