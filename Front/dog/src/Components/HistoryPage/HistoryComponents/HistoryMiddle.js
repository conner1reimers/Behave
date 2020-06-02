import React, { useState, Fragment } from 'react'
import { motion } from 'framer-motion';



const deleteVariants = {
    initial: {
        scale: .9,
        x: '-200%'


    },
    out: {


        scale: 0.8,
        x: '200%'


    },
    in: {

        scale: 1,
        x: '0%'
    }
}

const deleteTransition = {
    type: 'spring',
    mass: 2.3,
    damping: 30,
    stiffness: 900,
    velocity: 3
    
}

const HistoryMiddle = (props) => {

    const [expenseChosen, setExpenseChosen] = useState(true);
    const [incomeChosen, setIncomeChose] = useState(false);

    const chosenMonth = props.chosenMonth

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


    let content;
    if (expenseChosen) {
        const monthExpense = props.expenses[chosenMonth];
        
        if(monthExpense) {
            content = monthExpense.map((el, index) => {
                return (
                    <motion.li
                        key={index}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={deleteVariants}
                        transition={deleteTransition}
                        className="history--middle--expense-item"
                    >
                        <div>
                            {el.title}
                        </div>
                        

                    </motion.li>
                )
        })}

    }
    



    return (
        <Fragment>
            <div className="history--middle">

                <div className="history--middle--head-contain">
                    <h1 className="history--middle--expense-head">
                        <button onClick={chooseExpense} className={`btn history--middle--expense-btn ${expenseChosenClass}`}>Expenses</button>
                    </h1>
                    <h1 className="history--middle--expense-head">
                        <button onClick={chooseIncome} className={`btn history--middle--expense-btn ${incomeChosenClass}`}>Incomes</button>
                    </h1>
                </div>

                <ul className="history--middle--expense-list">
                    {content}
                </ul>
                

            </div>

            <div className="history--right">

                ed
    
            </div>

            <div className="history--right--lower">
                    geg
                </div>
        </Fragment>
    )
}

export default HistoryMiddle
