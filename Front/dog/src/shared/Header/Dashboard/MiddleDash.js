import React, { useState, useContext, Fragment, useCallback, useEffect} from 'react';
import Modal from '../../UIElements/Modal/Modal';
import BudgetEditor from '../../../Components/Budget/BudgetEditor';
import BudgetFooter from '../../../Components/Budget/BudgetFooter';
import IncomeIcon from '../../../lotties/EditBudgetIcons/IncomeIcon';
import { useHttpClient } from '../../../util/hooks/http-hook';
import { AuthContext } from '../../../util/context/auth-context';
import LoadingAnimation from '../../../lotties/LoadingAnimation/LoadingAnimation';
import ErrorModal from '../../ErrorModal/ErrorModal';
import { BudgetContext } from '../../../util/context/budget-context';
import trophy from './dashLeftImgs/trophy.svg'
import stars from './dashLeftImgs/stars.svg'
import { AnimatePresence, motion } from 'framer-motion';
import arrow from './arrow.svg'
import HideEvent from './FirstEvent/HideEvent';
import BudgetModal from './BudgetModal';
import FirstEvent from './FirstEvent/FirstEvent';
import {optionHandler} from '../../../util/myUtil.js';

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


const MiddleDash = React.memo((props) => {
    const [budgetEdit, setBudgetEdit] = useState(false);
    const [incomeEdit, setIncomeEdit] = useState(false);
    const [expenseEdit, setExpenseEdit] = useState(false);
    const [budgetState, setBudgetState] = useState(null);

    const [justSubmitted, setJustSubmitted] = useState(null);

    const [goalsHidden, setGoalsHidden] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);


    const auth = useContext(AuthContext)

    const { isLoading, error, sendRequest, clearError} = useHttpClient();


    const hideGoals = () => {
        setGoalsHidden((prevState) => !prevState);
    }

    const budgetOpenHandlr = () => {
        if(auth.isLoggedIn) {
            setModalOpen(true)
        } else {
            props.toggle()
        }
    }

    // FETCH NEXT UPCOMING EVENT
    const [hideUserEvent, setHideUserEvent] = useState(false);
    const [firstUserEvent, setFirstUserEvent] = useState(null);
    const fetchFirstEvent = useCallback(async () => {
        if (auth.isLoggedIn) {
            let response;
            try {
                response = await sendRequest(`http://localhost:5000/api/event/${auth.userId}`)
                setFirstUserEvent(response.event)
                console.log(response.event)
        } catch (err) {}
        
        }
    }, []);
    useEffect(() => {
        fetchFirstEvent()
    }, []);
    

    
    let budgetAmmount;
    let remaining;

    let expenseTotal;

    // MIDDLE SETUP
    const setupBudgetDisplay = () => {
        expenseTotal = props.expenseTotal

        if (props.userBudget) {
            
            if (!props.userBudget.ammount) {

                budgetAmmount = (<span className='dollars-text needTo-createBudget'> Please Create a Budget for this Month<br></br>
                                    <button 
                                        onClick={budgetOpenHandlr} 
                                        className="edit-budgetBtn-noBudget" 
                                        type="button"> {"Edit Budget"}
                                    </button> 
                                </span>)
                remaining = null

            } else {
                let budgetAmmountDollars;
                if (expenseTotal > 0 && props.userExpense.length > 0) {
                    budgetAmmountDollars = Number(parseFloat(props.userBudget.ammount) - expenseTotal
                    .toFixed(2)).toLocaleString('en', {minimumFractionDigits: 2});

                } else {
                    budgetAmmountDollars = Number(parseFloat(props.userBudget.ammount).toFixed(2))
                    .toLocaleString('en', {minimumFractionDigits: 2});
                }  
                budgetAmmount = <span className='dollars-text'>${budgetAmmountDollars} <br></br></span> 
                remaining = 'Remaining In Budget'
            };
        } else {
            budgetAmmount = (<span className='dollars-text needTo-createBudget'> Please Create a Budget for this Month <br></br>
            <div className="edit-div " onClick={budgetOpenHandlr}>
            <button className="edit-budgetBtn-noBudget"
                
                type="button"> {"<Edit Budget />"}
            </button> 
            </div>
        </span>)
            remaining = null
        }
    }

    let content;
    if (isLoading || props.isLoading) {
        content = (
        <Fragment>
            <LoadingAnimation loading={isLoading || props.isLoading}/>
        </Fragment>)
    } else {
        content = null;
    }

    setupBudgetDisplay();

    useEffect(() => {
        setupBudgetDisplay()

    }, [props.expenseTotal, props.userBudget, props.userExpense])

    const hideEventHandler = useCallback(() => {
        setHideUserEvent((prevState) => !prevState);
    }, [])

    let goals = props.goals;

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
            onClick={() => optionHandler(editGoal, setEditGoal, goal,"_id")}
            className="chosen-goals--item">
                <img src={trophy}/>
                <p>{goal.title}</p>
            </li>
            )
        })
    }


    return (
        <div className="middle">
                <ErrorModal error={error} clearError={clearError}/>
                {content}

                {firstUserEvent && !props.hideUserEvent &&(
                    <FirstEvent 
                        firstUserEvent={firstUserEvent} 
                        hideEventHandler={hideEventHandler}
                        hideUserEvent={hideUserEvent}/>
                )}

                    {hideUserEvent && (
                        <HideEvent hideEventHandler={hideEventHandler}/>
                    )}



                <BudgetModal
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    userBudget={props.userBudget}
                    setExp={props.setUserExpense}
                />


 


                <h3 className="budget-heading"></h3>

                <div className="dollars-left">
                    <div className="dollar-before">
                        {budgetAmmount}
                        {remaining && <span onClick={budgetOpenHandlr} className="remain">{remaining}</span>}
                    </div>
                </div>

                {chosenGoals.length > 0 &&  <button type="button" onClick={hideGoals} className="btn chosen-goals--hide"><img alt='' src={arrow}></img></button>}
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
                                </ul>
                                
                        </motion.div>
                
                    )}
                </AnimatePresence>


        </div>
    )
})

export default MiddleDash
