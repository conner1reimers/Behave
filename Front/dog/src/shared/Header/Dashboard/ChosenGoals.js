import React, { useState, Fragment } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import trophy from './dashLeftImgs/trophy.svg'
import stars from './dashLeftImgs/stars.svg'
import arrow from './arrow.svg'
import { optionHandler } from '../../../util/myUtil';
import MouseOverLabel from '../../../util/MouseOverLabel';
const pageVariants = {
    initial: {
        scale: .2,
        opacity: 0,
        y: '40%',
        rotate: 15


    },
    out: {


        scale: .2,
        opacity: 0,
        y: '70%',
        rotate: 15


    },
    in: {

        scale: 0.9,
        opacity: 1,
        y: '0%',
        rotate: 0
    }
}

const pageTransition = {
    type: 'spring',
    mass: 2.1,
    damping: 80,
    stiffness: 1200
    
} 

const pageVariants2 = {
    initial: {
        opacity: 1,
        y: '600%',
        rotate: -135


    },
    out: {
        opacity: 0,
        y: '600%',
        rotate: -135


    },
    in: {
        opacity: 1,
        y: '0%',
        rotate: 90
    }
}

const pageTransition2 = {
    type: 'spring',
    mass: 1.5,
    damping: 45,
    stiffness: 300
    
} 
const ChosenGoals = (props) => {
    let goals = props.goals;
    const [goalsHidden, setGoalsHidden] = useState(true);
    
    const hideGoals = () => {
        setGoalsHidden((prevState) => !prevState);
    }
    let chosenGoals;
    if (goals) {
        chosenGoals = goals.filter((goal) => {
            return goal.chosen === true
        })
    } else {
        chosenGoals = []
    }

    const [editGoal, setEditGoal] = useState({
        clicked: false,
        data: {}
    });
    let mappedChosenGoals;
    if (chosenGoals) {
        mappedChosenGoals = chosenGoals.map((goal) => {
            return (
            <li key={goal._id} 
            onClick={() => {optionHandler(editGoal, setEditGoal, goal,"_id");}}
            className="chosen-goals--item">
                <img src={trophy}/>
                <p>{goal.title}</p>
            </li>
            )
        })
    } 

    return (
        <Fragment>

            <AnimatePresence exitBeforeEnter>

            {chosenGoals.length > 0 && goalsHidden && (
                
                    <motion.button
                                initial="initial"
                                animate="in"
                                exit="out"
                                variants={pageVariants2}
                                transition={pageTransition2}
                                type="button" onClick={hideGoals} 
                                className="btn chosen-goals--hide">
                        
                        <MouseOverLabel
                        label="Show goals"
                        labelClass="edit-label hidelabel-goals"
                        visibleClass="vis"
                        hiddenClass="hid"
                        >
                                <img alt='' src={arrow}></img>
                        </MouseOverLabel>
                    </motion.button>
            )}

            </AnimatePresence>

            <AnimatePresence exitBeforeEnter>
                    {chosenGoals.length > 0 && !goalsHidden && (
                    
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                            className="chosen-goals"
                        >
                                <div className="chosen-goals--head">
                                    <img src={stars} alt=""/>
                                    <span>Top 3 goals:</span>
                                </div>
                                <ul className="chosen-goals--list">
                                    {mappedChosenGoals}
                                    <motion.button type="button" onClick={hideGoals} className="btn chosen-goals--hide">
                                    <MouseOverLabel
                                label="Hide goals"
                                labelClass="edit-label hidelabel-goals"
                                visibleClass="vis"
                                hiddenClass="hid"
                                >
                                    <img alt='' src={arrow}></img></MouseOverLabel>
                                </motion.button>

                                </ul>
                                
                                
                        </motion.div>
                
                    )}
                </AnimatePresence>
        </Fragment>)
}

export default ChosenGoals
