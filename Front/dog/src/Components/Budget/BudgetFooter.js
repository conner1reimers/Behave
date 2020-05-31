import React from 'react'
import getMonthYear from '../../util/getMonthYear';
import money from '../../util/busines.png'
import { AnimatePresence, motion } from 'framer-motion';
import MoneyAni from '../../lotties/MoneyAni';

const pageVariants = {
    initial: {
        x: "-800%",
        scale: .7,
        opacity: 1,
        rotate: 93


    },
    out: {

        x: "-100%",
        scale: .7,
        opacity: 0,
        rotate: 0


    },
    in: {
        x: "-10%",
        scale: 1,
        opacity: 1,
        rotate: 0



    }
}

const pageTransition = {
    type: 'spring',
    mass: 2.5,
    damping: 40,
    stiffness: 625,
    velocity: 1.3
}
const BudgetFooter = (props) => {
    let footerContent;
    
    const currentMonth = getMonthYear();

    let submittedName;
    if (props.budgetEdit && !props.incomeEdit && !props.expenseEdit) {
        submittedName = 'Budget'
    } else if (!props.budgetEdit && props.incomeEdit && !props.expenseEdit) {
        submittedName = 'Income'
    } else if (!props.budgetEdit && !props.incomeEdit && props.expenseEdit) {
        submittedName = 'Expense'
    }


    const submittedText = props.justSubmitted 
    ? (
        <AnimatePresence exitBeforeEnter>
            <motion.div 
                className="submit-text"
                animate="in"
                style={{overflow: "hidden"}}
                exit="out"
                variants={pageVariants}
                transition={pageTransition} 
            >
                <MoneyAni/>
                    <p>Submitted {submittedName}!</p>
                <img className="submitted-img" src={money}/>
            </motion.div>
        </AnimatePresence>
    )
    : null

    let budgetAmmt;
    if (props.userBudget) {
        budgetAmmt = Number(parseFloat(props.userBudget.ammount).toFixed(2)).toLocaleString('en', {
            minimumFractionDigits: 2
        });
    } else {
        budgetAmmt = "Have not created budget"
    }

    if (!props.budgetEdit && !props.incomeEdit && !props.expenseEdit) {
        
        footerContent = (
        <footer className="footer-budget">
            
        </footer>
        )

    } else if (props.budgetEdit && !props.incomeEdit && !props.expenseEdit) {
        footerContent = (
            <footer className="footer-budget">
                <button type="submit" className="btn btn-budgetSubmit">Submit</button>
                {!props.justSubmitted && <p className="cur-bud">Current Budget For {currentMonth}: <span className="cur-bud-money">$ {budgetAmmt}</span> </p>}
                {props.justSubmitted && submittedText}

            </footer>
            )
    } else if (!props.budgetEdit && props.incomeEdit && !props.expenseEdit) {
        footerContent = (
            <footer className="footer-budget">
                <button type="submit" className="btn btn-budgetSubmit">Submit</button>
                {props.justSubmitted && submittedText}
            </footer>
            )
    } else if (!props.budgetEdit && !props.incomeEdit && props.expenseEdit) {
        footerContent = (
            <footer className="footer-budget">
                <button type="submit" className="btn btn-budgetSubmit">Submit</button>
                {props.justSubmitted && submittedText}
            </footer>
            )
    }

    return footerContent;
}

export default BudgetFooter
