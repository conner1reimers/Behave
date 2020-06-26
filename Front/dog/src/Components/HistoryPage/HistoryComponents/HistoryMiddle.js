import React, { useState, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { ListItem, Typography, ThemeProvider, createMuiTheme, List } from '@material-ui/core';



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
    stiffness: 100

    
}

const HistoryMiddle = (props) => {

    const [expenseChosen, setExpenseChosen] = useState(true);
    const [incomeChosen, setIncomeChose] = useState(false);

    const theme = createMuiTheme();

    theme.typography.h1 = {
        fontSize: '1.8rem',
        '@media (min-width:600px)': {
            fontSize: '2.5rem',
        },
    }
    theme.typography.h2 = {
        fontSize: '1.8rem',
        '@media (min-width:600px)': {
            fontSize: '2.5rem',
        },
    }
    theme.typography.h3 = {
        fontSize: '1.8rem',
        '@media (min-width:600px)': {
            fontSize: '2.5rem',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '2.4rem',
        },
        };

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
                        className="history--middle--expense-item--inner"
                        
                    >
                        <span className="history--middle--expense-item--info-title">
                            {el.title}
                        </span>
                        <span 
                        
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
                        className="history--middle--expense-item--inner"
                        
                    >
                        <span className="history--middle--expense-item--info-title">
                            {el.title}
                        </span>
                        <span 
                        
                        className="history--middle--expense-item--info-ammount">
                            {`$ ${el.ammount.toFixed(2)}`}
                        </span>
                        

                    </motion.li>
                    </AnimatePresence>
                )
        })}

    }
    



    return (
        <ThemeProvider theme={theme}>
            <div className="history--middle">

                <div className="history--middle--head-contain">
                    <h1 className="history--middle--expense-head">
                        <button onClick={chooseExpense} className={`btn history--middle--expense-btn ${expenseChosenClass}`}>Expenses</button>
                    </h1>
                    <h1 className="history--middle--expense-head">
                        <button onClick={chooseIncome} className={`btn history--middle--expense-btn ${incomeChosenClass}`}>Incomes</button>
                    </h1>
                </div>

                <List component="ul" className="history--middle--expense-list">
                    <ListItem
                        className="history--middle--expense-item"
                    >
                        <Typography variant="h1" component="h2" className="history--middle--expense-item--info-title title-word">Title</Typography>
                        <Typography variant="h1" component="h2" className="history--middle--expense-item--info-ammount title-word--ammount">Ammount</Typography>
                    </ListItem>

                    {content}
                    <div className="backlist"></div>
                    <div className="backlist2"></div>

                </List>
                

            </div>

            <div className="history--right">

    
            </div>

            <div className="history--right--lower">
                   
                </div>
        </ThemeProvider>
    )
}

export default HistoryMiddle
