import React, { useState, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion';



const deleteVariants = {
    initial: {
        scale: 1,
        opacity: 0.4,
        rotate: 0,


    },
    out: {
        scale: 0.8,
        opacity: 0.4,
        rotate: 3


    },
    in: {
        scale: 1,
        opacity: 1,
        rotate: 0,
    }
}

const deleteTransition = {
    type: 'spring',
    velocity: 1.5,
    mass: 2.5,
    damping: 30,
    stiffness: 700


    
}

const HistoryMiddle = (props) => {

    const [expenseChosen, setExpenseChosen] = useState(true);
    const [incomeChosen, setIncomeChose] = useState(false);

    const chosenMonth = props.chosenMonth;

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
                    <AnimatePresence exitBeforeEnter key={index}>
                    <motion.li
                        key={index}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={deleteVariants}
                        transition={deleteTransition}
                        className="history--middle--expense-item"
                        style={{
                            borderRadius: '.6rem',
                            transition: 'all .2s',
                            filter: 'drop-shadow(1px 1px .5px #b8bbb76e)',
                            backgroundColor: 'rgba(64, 110, 102, 0.849)'

                        }}
                    >
                        <span className="history--middle--expense-item--info-title">
                            {el.title}
                        </span>
                        <span 
                        style={{
                            marginRight: '2.5rem',
                            color: '#90cb97',
                            width: '15rem'
                    
                    }}
                        className="history--middle--expense-item--info-ammount">
                            {`$ ${el.ammount.toFixed(2)}`}
                        </span>
                        

                    </motion.li>
                    </AnimatePresence>
                )
        })}

    } else if (incomeChosen) {
        const monthIncome = props.incomes[chosenMonth];
        
        if(monthIncome) {
            content = monthIncome.map((el, index) => {
                return (
                    <AnimatePresence exitBeforeEnter key={index}>
                    <motion.li
                        key={index}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={deleteVariants}
                        transition={deleteTransition}
                        className="history--middle--expense-item"
                        style={{
                            borderRadius: '.6rem',
                            transition: 'all .2s',
                            filter: 'drop-shadow(1px 1px .5px #b8bbb76e)',
                            backgroundColor: 'rgba(64, 110, 102, 0.749)'

                        }}
                    >
                        <span className="history--middle--expense-item--info-title">
                            {el.title}
                        </span>
                        <span 
                        style={{
                            marginRight: '2.5rem',
                            color: '#90cb97',
                            width: '15rem'
                    
                    }}
                        className="history--middle--expense-item--info-ammount">
                            {`$ ${el.ammount.toFixed(2)}`}
                        </span>
                        

                    </motion.li>
                    </AnimatePresence>
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
                    <li
                        className="history--middle--expense-item"
                    >
                        <span className="history--middle--expense-item--info-title title-word">Title</span>
                        <span className="history--middle--expense-item--info-ammount title-word">Ammount</span>
                    </li>

                    {content}
                    <div className="backlist"></div>
                    <div className="backlist2"></div>

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
