import React, { useState, useContext, Fragment, useCallback, useEffect} from 'react';
import Modal from '../../UIElements/Modal/Modal';
import BudgetEditor from '../../../Components/Budget/BudgetEditor';
import BudgetFooter from '../../../Components/Budget/BudgetFooter';
import IncomeIcon from '../../../lotties/EditBudgetIcons/IncomeIcon';
import { useHttpClient } from '../../../util/hooks/http-hook';
import { AuthContext } from '../../../util/context/auth-context';
import LoadingAnimation from '../../../lotties/LoadingAnimation/LoadingAnimation';
import Backdrop from '../../UIElements/Modal/Backdrop';
import ErrorModal from '../../ErrorModal/ErrorModal';
import { BudgetContext } from '../../../util/context/budget-context';
import { ResetContext } from '../../../util/context/reset-context';
import Media from 'react-media';
import trophy from './dashLeftImgs/trophy.svg'
import stars from './dashLeftImgs/stars.svg'
import { AnimatePresence, motion } from 'framer-motion';
import arrow from './arrow.svg'
import calendar from './dashLeftImgs/calendar.svg'
import calendar2 from './dashLeftImgs/calendar2.svg'
import clock from './dashLeftImgs/clock.svg'
import menu from './dashLeftImgs/menu.svg'

import MouseOverLabel from '../../../util/MouseOverLabel';
import HideEvent from './HideEvent/HideEvent';

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


    const reset = useContext(ResetContext)
    const auth = useContext(AuthContext)
    const bugetContext = useContext(BudgetContext)

    const { isLoading, error, sendRequest, clearError} = useHttpClient();

    const editBudget = () => {
        setBudgetEdit(true);
        setJustSubmitted(false);
    }
    const editExpense = () => {
        setExpenseEdit(true);
        setJustSubmitted(false);

    }
    const editIncome = () => {
        setIncomeEdit(true);
        setJustSubmitted(false);

    }

    const cancelHandler = () => {
        setBudgetEdit(false);
        setModalOpen(false);
        setExpenseEdit(false);
        setIncomeEdit(false);
        setJustSubmitted(false);


    }

    const goBack = (event) => {
        event.preventDefault();
        setBudgetEdit(false);
        setExpenseEdit(false);
        setIncomeEdit(false);
        setJustSubmitted(false);

    }

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

    // BACK BUTTON FOR BUDGET EDITOR
    const backButton = (!budgetEdit && !incomeEdit && !expenseEdit) ? null
    : (
        <button onClick={goBack} className="back-btn">BACK</button>
    )
    
    // PASSING THE DATA BACK;
    const passData = (data) => {
        // dad = data;
        setBudgetState(data);
    }
    let budgetAmt;

    // SUBMIT BUDGET DATA FUNCTION
    const submitDataToBudget = async (event) => {
        event.preventDefault();

        const date = new Date()
        let month = (date.getMonth() + 1).toString()
        let year = date.getFullYear().toString();
        
        if (month.length <= 1) {
            month = '0' + month
        }
        const curMonth = month + year

    if (budgetEdit && !incomeEdit && !expenseEdit) {
        let response
        if (props.userBudget) {
            budgetAmt = props.userBudget.ammount

        }

        setJustSubmitted(false);
        try {
            response = await sendRequest('http://localhost:5000/api/budget', 'POST',
                JSON.stringify({
                    month: curMonth,
                    ammount: budgetState.inputs.ammount.value,
                    creator: auth.userId

                }),
                {
                    'Content-Type': 'application/json',
                    
                });
            setJustSubmitted(true);
            if (props.expenseTotal > 0) {
                budgetAmt = budgetState.inputs.ammount.value - props.expenseTotal;
                const newBudget = ({
                    month: curMonth,
                    ammount: budgetState.inputs.ammount.value,
                    creator: auth.userId
                });
                bugetContext.setBug(newBudget);
            } else {
                budgetAmt = budgetState.inputs.ammount.value;
                const newBudget = ({
                    month: curMonth,
                    ammount: budgetAmt,
                    creator: auth.userId
                });
                bugetContext.setBug(newBudget);
            };
            

        } catch(err) {}
        

    } else if (!budgetEdit && incomeEdit && !expenseEdit) {
        let response;
        setJustSubmitted(false);
        try {
            response = await sendRequest('http://localhost:5000/api/income', 'POST',
                JSON.stringify({
                    title: budgetState.inputs.category.value,
                    description: budgetState.inputs.description.value,
                    month: curMonth,
                    ammount: budgetState.inputs.income.value,
                    creator: auth.userId

                }),
                {
                    'Content-Type': 'application/json',
                    
                });
                setJustSubmitted(true);

        } catch(err) {}
    } else if (!budgetEdit && !incomeEdit && expenseEdit) {
        let response;
        setJustSubmitted(false);
        try {
            response = await sendRequest('http://localhost:5000/api/expense', 'POST',
                JSON.stringify({
                    title: budgetState.inputs.category.value,
                    description: budgetState.inputs.description.value,
                    month: curMonth,
                    ammount: budgetState.inputs.expense.value,
                    creator: auth.userId
                }),
                {
                    'Content-Type': 'application/json',
                    
                })
                setJustSubmitted(true);
                let expense = response.expense
                let expenses = props.userExpense
                expenses.push(expense)
                

                let techExp = expenses.map((el) => {
                    if (el.title === 'tech') {
                        return el
                    } else {
                        return {title: 'tech', ammount: 0}}
                });
                let kidExp = expenses.map((el) => {
                    if (el.title === 'kids') {
                        return el
                    } else {
                        return {title: 'kids', ammount: 0}}
                });
                let billExp = expenses.map((el) => {
                    if (el.title === 'bills') {
                        return el
                    } else {
                        return {title: 'bills', ammount: 0}}
                });
                let entertainExp = expenses.map((el) => {
                    if (el.title === 'entertainment') {
                        return el
                    } else {
                        return {title: 'entertainment', ammount: 0}}
                });
                let foodExp = expenses.map((el) => {
                    if (el.title === 'food') {
                        return el
                    } else {
                        return {title: 'food', ammount: 0}}
                });
                let otherExp = expenses.map((el) => {
                    if (el.title === 'other') {
                        return el
                    } else {
                        return {title: 'other', ammount: 0}
                    }
                });
                let supplyExp = expenses.map((el) => {
                    if (el.title === 'supplies') {
                        return el
                    } else {
                        return {title: 'supplies', ammount: 0}
                    }
                });

                techExp = techExp.filter(el => el !== undefined).map(el => el.ammount).reduce((acc, cur) => acc + cur)
                kidExp = kidExp.filter(el => el !== undefined).map(el => el.ammount).reduce((acc, cur) => acc + cur)
                foodExp = foodExp.filter(el => el !== undefined).map(el => el.ammount).reduce((acc, cur) => acc + cur)
                entertainExp = entertainExp.filter(el => el !== undefined).map(el => el.ammount).reduce((acc, cur) => acc + cur)
                supplyExp = supplyExp.filter(el => el !== undefined).map(el => el.ammount).reduce((acc, cur) => acc + cur)
                otherExp = otherExp.filter(el => el !== undefined).map(el => el.ammount).reduce((acc, cur) => acc + cur)
                billExp = billExp.filter(el => el !== undefined).map(el => el.ammount).reduce((acc, cur) => acc + cur)

                let totalExpenses = [
                {   title: 'food',
                    ammount: foodExp
                },{ title: 'bills',
                    ammount: billExp
                },{ title: 'kids',
                    ammount: kidExp
                },{ title: 'tech',
                    ammount: techExp
                },{ title: 'supplies',
                    ammount: supplyExp
                },{ title: 'entertainment',
                    ammount: entertainExp
                },{ title: 'other',
                    ammount: otherExp
                }]
                totalExpenses = totalExpenses.filter(el => el.ammount !== 0)
                // bugetContext.setAddedUpExpenses(totalExpenses)

                let expenseTotalArray = expenses.map((el) => {
                    return el.ammount
                })

                bugetContext.setExp(totalExpenses)
                const added = expenseTotalArray.reduce((cur, acc) => {return cur + acc});
                bugetContext.setAddedUpExpenses(added)



                
        } catch(err) {}}};

    
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


    let mappedChosenGoals;
    if (chosenGoals) {
        mappedChosenGoals = chosenGoals.map((goal, index) => {
            return (
            <li key={index} className="chosen-goals--item">
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

                {firstUserEvent && (
                    <AnimatePresence exitBeforeEnter>
                        {firstUserEvent && !hideUserEvent && (
                            <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                            className="first-event"
                            >   
                                <span className="first-event--box"></span>

                                <header className="first-event--head">
                                    <img src={calendar2} alt=""/>
                                    <h1>Coming Up On Your Calendar:</h1>
                                    <MouseOverLabel
                                    label="Hide Upcoming Event"
                                    visibleClass="vis"
                                    hiddenClass="hid"
                                    labelClass="first-event--mouseover"
                                    // class="mouseover-main--outterDiv"
                                    >
                                        <button onClick={hideEventHandler} className="btn first-event--btn">
                                            <img src={menu} alt=""/>
                                        </button>
                                    </MouseOverLabel>
                                </header>
                                
                                <div className="first-event--content">
                                    <img src={clock} alt=""/>
                                    <p>{firstUserEvent.title}</p>
                                </div>
                                
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                    {hideUserEvent && (
                        <HideEvent hideEventHandler={hideEventHandler}/>
                    )}
                <Media query="(max-width: 450px)">
                <Modal
                    cancel={cancelHandler} 
                    onSubmit={submitDataToBudget}
                    header={<div className="budget-head">Setup Your Budget! <IncomeIcon/> {backButton} </div>}
                    headerClass="budgetHead"
                    footer={<BudgetFooter 
                        passedData={passData}
                        budgetEdit={budgetEdit}
                        incomeEdit={incomeEdit}
                        expenseEdit={expenseEdit}  
                        justSubmitted={justSubmitted}
                        userBudget={props.userBudget}  

                        />}
                    show={modalOpen}
                    >
                        <BudgetEditor 
                            setModalOpen={setModalOpen} 
                            modalOpen={modalOpen}
                            editIncomeToggle={editIncome}
                            editBudgetToggle={editBudget}
                            editExpenseToggle={editExpense}
                            budgetEdit={budgetEdit}
                            incomeEdit={incomeEdit}
                            expenseEdit={expenseEdit}
                            passData={passData}
                            existingUserBudget={props.userBudget}  
                            existingUserIncome={props.userIncome}                            
                            existingUserExpense={props.userExpense}
                            justSubmitted={justSubmitted}                            
                          
                        /> 
                </Modal>
                </Media>

                <Media query="(min-width: 450px)">
                <Modal
                    cancel={cancelHandler} 
                    onSubmit={submitDataToBudget}
                    header={<div className="budget-head">Setup Your Budget! <IncomeIcon/> {backButton} </div>}
                    headerClass="budgetHead"
                    footer={<BudgetFooter 
                        passedData={passData}
                        budgetEdit={budgetEdit}
                        incomeEdit={incomeEdit}
                        expenseEdit={expenseEdit}  
                        justSubmitted={justSubmitted}
                        userBudget={props.userBudget}  

                        />}
                    show={modalOpen}
                    img="moni"
                    art
                    >
                        <BudgetEditor 
                            setModalOpen={setModalOpen} 
                            modalOpen={modalOpen}
                            editIncomeToggle={editIncome}
                            editBudgetToggle={editBudget}
                            editExpenseToggle={editExpense}
                            budgetEdit={budgetEdit}
                            incomeEdit={incomeEdit}
                            expenseEdit={expenseEdit}
                            passData={passData}
                            existingUserBudget={props.userBudget}  
                            existingUserIncome={props.userIncome}                            
                            existingUserExpense={props.userExpense}
                            justSubmitted={justSubmitted}                            
                          
                        /> 
                </Modal>
                </Media>
            


                <h3 className="budget-heading"></h3>

                <div className="dollars-left">
                    <div className="dollar-before">
                        {budgetAmmount}
                        {remaining && <span onClick={budgetOpenHandlr} className="remain">{remaining}</span>}
                    </div>
                </div>

                <div className="middledash-bottom">
                    <img alt="" src=''/>

                    

                </div>

                {/* <div className="saved-container">
                    <p  style={
                        {color: '#ccc'}}>You have saved <span 
                    style={
                        {color: '#a4d0ad',
                        fontSize: '1.8rem',
                        padding: '0rem',
                        margin: '0',
                        borderBottom: '1px solid #c46035ec',
                        lineHeight: '2.2rem',
                        display: 'inline-block'
                        }}>$2,401</span></p>
                </div> */}


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
