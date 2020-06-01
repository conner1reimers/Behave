import React, { useState } from 'react'

const HistoryMiddle = () => {

    const [expenseChosen, setExpenseChosen] = useState(true);
    const [incomeChosen, setIncomeChose] = useState(false);


    let expenseChosenClass;
    let incomeChosenClass;

    const chooseExpense = (event) => {
        event.preventDefault();
        setIncomeChose(false);
        setExpenseChosen(true);

    }
    const chooseIncome = (event) => {
        event.preventDefault();
        setIncomeChose(true);
        setExpenseChosen(false);

    }

    if (expenseChosen) {
        expenseChosenClass = "history-chosen"
        incomeChosenClass = null
    } else if (incomeChosen) {
        incomeChosenClass = "history-chosen"
        expenseChosenClass = null
    };

    



    return (
        <div className="history--middle">

            <div className="history--middle--head-contain">
                <h1 className="history--middle--expense-head">
                    <button onClick={chooseExpense} className={`btn history--middle--expense-btn ${expenseChosenClass}`}>Expenses</button>
                </h1>
                <h1 className="history--middle--expense-head">
                    <button onClick={chooseIncome} className={`btn history--middle--expense-btn ${incomeChosenClass}`}>Incomes</button>
                </h1>
            </div>




        </div>
    )
}

export default HistoryMiddle
