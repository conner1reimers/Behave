import React, { useState, useEffect, Fragment } from 'react'
import {getMonthYearNumbered} from '../../../util/getMonthYear';
import { AnimatePresence, motion } from 'framer-motion';


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

const HistoryLeft = (props) => {
    const curMonth = getMonthYearNumbered()

    const [monthSet, setMonthSet] = useState('062020');
    const [clickedMonth, setClickedMonth] = useState({
        clicked: curMonth,
        isClick: true
    });


    useEffect(() => {
        setMonthSet(curMonth)
    },[])

    const months = {
        '052020': 'May, 2020',
        '062020': 'June, 2020',
        '072020': 'July, 2020',
        '082020': 'August, 2020',
    }

    const monthChoose = (month) => {
        setMonthSet(month)
        setClickedMonth({
            clicked: month,
            isClick: true
        })
    };


    let monthList;
    const setMonthList = () => {
        monthList = props.budgets.map((el, index) => {
        
            let dotElement;
            if (monthSet) {
                if (clickedMonth.clicked === el.month){
                dotElement = (
                    <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={deleteVariants}
                    transition={deleteTransition}
                    className="choose-month-ani"
                    >
                        {el.month}
                    </motion.div>
                )
            }}
            return (

            <li 
                onClick={() => monthChoose(el.month)} 
                key={el.month}

                className={`history--month-item ${el.month === monthSet ? 'monthChosen' : ''}`}
            >
                <p>{months[el.month]}
                
                
                </p>
    
 
                {el.month === monthSet && (
                <AnimatePresence 
                exitBeforeEnter
                key={index}
                >
                    {dotElement}
                </AnimatePresence>)}
                
            </li >
            
        )})
    }

    setMonthList();

    useEffect(() => {
        props.passData(monthSet)
        setMonthList()
    }, [monthSet])


    
    return (
        <Fragment>
            <div className="history--sidebar">
                <h1 className="sidebar-head">Months: </h1>

                <ul className="history--month-list">
                    {monthList}
                </ul>
            </div>
            <div className="history--sidebar2">
                <h1 className="sidebar-head">Months: </h1>

                
            </div>
        </Fragment>
    )
}

export default HistoryLeft
