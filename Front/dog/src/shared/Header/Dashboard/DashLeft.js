import React, { useEffect, useContext, useState, Fragment } from 'react'
import Typed from 'react-typed';
import Calendar2 from '../../../lotties/Calendar2';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../../util/context/auth-context';
import business from './dashLeftImgs/businesss.png';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import Modal from '../../UIElements/Modal/Modal';
import CalendarModal from '../../../Components/Calendar/CalendarModal';
import getMonthYear, { getMonthYearNumbered } from '../../../util/getMonthYear';
import { BudgetContext } from '../../../util/context/budget-context';

import pencil from './dashLeftImgs/pencil.svg';
import remove from './dashLeftImgs/remove.svg';
import wrench from './dashLeftImgs/wrench.svg';
import register from './dashLeftImgs/register.svg';
import kill from './dashLeftImgs/kill.svg'
import question from './dashLeftImgs/question.svg'


import MouseOverLabel from '../../../util/MouseOverLabel';
import MsgModal from '../../UIElements/Modal/MsgModal';
import {useHttpClient} from '../../../util/hooks/http-hook';
import LoadingAnimation from '../../../lotties/LoadingAnimation/LoadingAnimation';
import { ResetContext } from '../../../util/context/reset-context';
import Input from '../../UIElements/Input/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_NUMBER } from '../../../util/validators';
import { useForm } from '../../../util/hooks/useForm';

const pageVariants = {
    initial: {
        scale: .9,
        opacity: 1,
        x: '-20%'


    },
    out: {


        scale: 0,
        opacity: 0,
        x: '-20%'


    },
    in: {

        scale: 1,
        opacity: 1,
        x: '0%'
    }
}

const pageTransition = {
    type: 'spring',
    mass: .1,
    damping: 9,
    stiffness: 9000
    
}

const deleteVariants = {
    initial: {
        scale: .9,
        x: '200%'


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
    mass: 1.3,
    damping: 50,
    stiffness: 700,
    velocity: 3
    
}

const editVariants = {
    initial: {
        scale: .9,
        x: '-0%',
        opacity: 0


    },
    out: {


        scale: 0.8,
        x: '-150%',
        opacity: .4


    },
    in: {

        scale: 1,
        x: '35%',
        opacity: 1.4
    }
}

const editTransition = {
    type: 'spring',
    mass: 2.7,
    damping: 23,
    stiffness: 550,
    velocity: 6,

    
}

const editExpenseVariants = {
    initial: {
        scale: .9,
        x: '450%',
        opacity: 0


    },
    out: {


        scale: 0.8,
        x: '350%',
        opacity: 0


    },
    in: {

        scale: 1,
        x: '145%',
        opacity: 1.4
    }
}

const editExpenseTransition = {
    type: 'spring',
    mass: 2.7,
    damping: 83,
    stiffness: 750,
    velocity: 6,

    
}



const DashLeft = (props) => {
    const dateNow = getMonthYear();

    const [modalOpen, setModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteName, setDeleteName] = useState(null)
    const [editExpenseName, setEditExpenseName] = useState(null)

    const [editAnimationState, setEditAnimationState] = useState(null)
    
    const {isLoading, error, sendRequest, clearError} = useHttpClient()

    const curMonth = getMonthYearNumbered()
    
    const auth = useContext(AuthContext);
    const budget = useContext(BudgetContext)
    const reset = useContext(ResetContext);
    
    const [formState, inputHandler] = useForm({
        ammount: {
            value: '',
            isValid: false
        }
    }, false);

    const eventModalOpen = () => {
        if(auth.isLoggedIn) {
            setModalOpen(true)
        } else {
            props.toggle()
        }
    }

    const editExpenseAmmount = (event, id) => {
        if (editAnimationState) {
            if (editAnimationState.id === id && isDelete.clicked === true) {
                setEditAnimationState((prevState) => {return {...prevState, clicked: false}});
            } else {
                setEditAnimationState({id: id, clicked: true});
            }
        } else {
            setEditAnimationState({id: id, clicked: true});

        }
    }

    const submitHandler = async (event) => {
        event.preventDefault()
        let response;
        try {
            response = await sendRequest(`http://localhost:5000/api/expense/${editAnimationState.id}`, 'PATCH',
            JSON.stringify({
                ammount: formState.inputs.ammount.value
            }),
            {'Content-Type': 'application/json'}
            );
            setEditAnimationState(false)

            console.log(response)

            props.setEntireBudget((prevState) => {
                let prev = prevState.expense.filter((el) => {
                    return el._id !== response.expense.id
                });
                prev.push(response.expense)

                const expensesThisMonth = prev.filter((el) => el.month === curMonth);

                const createdArray = expensesThisMonth.length > 0 ? props.createExpensesArray(expensesThisMonth) : [];
                const added = expensesThisMonth.length > 0 ? expensesThisMonth.map((el) => el.ammount).reduce((acc, curr) => acc + curr) : 0;
            
                props.setExpenseTotal(added)
                props.setUserExpense(createdArray)
                console.log(createdArray)


                return {
                    ...prevState,
                    expense: prev
                }
            });
                                   
        } catch (err) {}
    }

    let editModalContent;
    let displayExpenses;

    const setEditModal = (title) => {
        if (props.entireBudget && editExpenseName) {
            displayExpenses = props.entireBudget.expense
                .filter((el) => el.month === curMonth)
                .filter((el) => el.title === editExpenseName);
            

        editModalContent = displayExpenses.map((el) => {
                let expenseDescription;
                let editExpenseInput;
                if (el.description !== '') {
                    expenseDescription = el.description
                } else {
                    expenseDescription = 'No Description'
                };

                editExpenseInput = (
                    <motion.div
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={editExpenseVariants}
                        transition={editExpenseTransition}
                        className="expense-item--input"
                        // onClick={(event) => toggleEditItem(event, expense.title)}
                    >
                        <Input 
                            name="New Ammount" 
                            id="ammount"
                            validator={VALIDATOR_NUMBER()}
                            onInput={inputHandler}
                            type="text"
                            errorText="Numbers only..."
                            class="expense-edit-input"
                            errorClass="newAmtErrTxt"
                        />
                        <button type="submit" className="btn btn-submit expense-item--input--btn">Submit</button>
                    </motion.div>)

                return (
                    <li 
                        className="expense-edit-list--item"
                        key={el._id}
                    >
                       <MouseOverLabel
                            label={expenseDescription}
                            labelClass="label-expense-edit"
                            visibleClass="vis"
                            hiddenClass="hid"
                       >
                            <img alt="" className="expense-edit-list--item--info" src={question}></img>

                            <p>{el.title}</p>

                       </MouseOverLabel> 

                        <p className="expense-edit-list--item--ammount" style={{marginLeft: '3rem'}}>${el.ammount}</p>
                        {editAnimationState && (
                                        <AnimatePresence exitBeforeEnter>
                                        {editAnimationState.id === el._id && editExpenseInput}
                                        </AnimatePresence>
                                    )} 

                        <div style={{marginRight: '3rem'}} className="expense-edit-list--item--btn-contain">

                                <MouseOverLabel
                                    label="Delete Expense"
                                    labelClass="label-expense-edit kill"
                                    visibleClass="vis"
                                    hiddenClass="hid"
                                    
                            >
                                    <button type="button" onClick={(event) => deleteSingleHandler(event, el._id)} className="btn expense-edit-list--item--btn hov"><img alt='' src={kill}></img></button>
                                    
                                </MouseOverLabel>
                                
                                    <MouseOverLabel
                                    label="Edit Ammount"
                                    labelClass="label-expense-edit register"
                                    visibleClass="vis"
                                    hiddenClass="hid"
                            >
                                    <button type="button" onClick={(event) => editExpenseAmmount(event, el._id)} className="btn expense-edit-list--item--btn hov"><img alt='' src={register}></img></button>

                                    </MouseOverLabel>
                                    
                        </div>
                        
                        
                    </li>)
        })
        }

        
    }

    const openEditModalHandler = (event, title) => {        
        setEditModal(title)
        setDeleteModalOpen(false)
        event.preventDefault();
        event.cancelBubble = true
        event.stopPropagation()
        setEditModalOpen(true)


    }

    const openDeleteModalHandler = (event) => {
        event.preventDefault();
        event.cancelBubble = true
        event.stopPropagation()
        setDeleteModalOpen(true)
        
    }

    const cancelHandler = () => {
        setModalOpen(false);
        setDeleteModalOpen(false);
        setEditModalOpen(false);
        setDeleteName(null)
        setEditExpenseName(null)
        setIsEdit(false)
    }

    const [isDelete, setIsDelete] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const deleteHandler = async (event) => {
        event.preventDefault();
        let response;
        try {
            response = await sendRequest('http://localhost:5000/api/expense/deletegroup', 'DELETE',
            JSON.stringify({
                title: deleteName,
                creator: auth.userId
            }),
            {'Content-Type': 'application/json'}
            )
            let expense = props.userExpense         
            let newExpenses = expense.filter((el) => {
                return el.title !== deleteName
            })

            let expenseTotalArray = newExpenses.map((el) => {
                return el.ammount
            })

            props.setUserExpense(newExpenses)
            budget.setExp(newExpenses)
            const added = expenseTotalArray.reduce((cur, acc) =>{ return cur + acc});
            props.setExpenseTotal(added)
            budget.setAddedUpExpenses(added)
            cancelHandler()
            
        } catch (err) {}


    }

    console.log(props.userExpense)

    const deleteSingleHandler = async (event, id) => {
        event.preventDefault();
        
        let response;
        try {
            response = await sendRequest(`http://localhost:5000/api/expense/${id}`, 'DELETE',
            {'Content-Type': 'application/json'}
            )

            props.setEntireBudget((prevState) => {
                let prev = prevState.expense.filter((el) => {
                    return el._id !== id
                });

                const expensesThisMonth = prev.filter((el) => el.month === curMonth);

                const createdArray = expensesThisMonth.length > 0 ? props.createExpensesArray(expensesThisMonth) : [];
                const added = expensesThisMonth.length > 0 ? expensesThisMonth.map((el) => el.ammount).reduce((acc, curr) => acc + curr) : 0;
            
                props.setExpenseTotal(added)
                props.setUserExpense(createdArray)
                console.log(createdArray)


                return {
                    ...prevState,
                    expense: prev
                }
            });
                                   
        } catch (err) {}

    }


    setEditModal()

    const overflowHide = isEdit ? {
        overflow: 'visible'
    } : {
        overflow: 'hidden'
    }

    const toggleDeleteItem = (event) => {
        if (isDelete && props.userExpense.length > 0) {
            const clickedName = event.target.firstChild.id;

            if (isDelete.name === clickedName && isDelete.clicked === true) {
                setIsDelete((prevState) => {return {...prevState, clicked: false}});
                setIsEdit(false)
            } else {
                const clickedName = event.target.firstChild.id;
                setIsDelete({name: clickedName, clicked: true});
                setIsEdit(false)
            }
        } else {
            const clickedName = event.target.firstChild.id;
            setIsDelete({name: clickedName, clicked: true});
            setIsEdit(false)

        }
    }

    const toggleEditItem = (event, title) => {
        event.cancelBubble = true
        event.stopPropagation()

        const clickedName = title;
        setEditExpenseName(title)
        setDeleteName(title)

        if (isEdit) {
            if (isEdit.name === clickedName && isEdit.clicked === true) {
                setIsEdit({name: clickedName, clicked: false});
            } else {
                setIsEdit({name: clickedName, clicked: true});
            }
        } else {
            setIsEdit({name: clickedName, clicked: true});

        }


    }

    let expenseList;
    let expenses;
    

    const deleteModalContent = (
        <Fragment>
            <h1  className="delete-modal--head">You sure you want to delete this expense(s)?</h1>
            <div className="delete-modal--btns">
                <button onClick={deleteHandler} id="btn" className="delete-modal--btn btn btn--yes btn-err" type="button">YES</button>
                <button onClick={cancelHandler}  id="btn" className="delete-modal--btn btn btn-err" type="button">CANCEL</button>
            </div>
            <p className="delete-modal--bottomtext">Choose to <button onClick={openEditModalHandler} type="button" className="btn delete-modal--edit">edit</button> instead</p>
        </Fragment>
    );

    const setExpenses = () => {
        
        if (props.userExpense) {
            expenses = props.userExpense;
        } else {
            expenses = []
        }
        if(expenses) {
            if (expenses.length > 0 && expenses !== 'not found') {
                expenseList = expenses.map((expense, index) => {
                    let deleteElement;
                    if (isDelete) {
                        if (isDelete.name === expense.title) {
                            if (isDelete.clicked === true) {

                                deleteElement = (
                                    <motion.div
                                        initial="initial"
                                        animate="in"
                                        exit="out"
                                        variants={deleteVariants}
                                        transition={deleteTransition}
                                        className="expense-item--delete"
                                        onClick={(event) => toggleEditItem(event, expense.title)}
                                    >
                                        <img alt="" id={expense.title} className="pen1" src={pencil}></img>
                                        <img alt="" className="pen2" src={pencil}></img>

                                    </motion.div>)
                            }
                        }
                    }
                    let editElement;
                    if (isEdit) {
                        if (isEdit.name === expense.title) {
                            if (isEdit.clicked === true) {
                                editElement = (
                                        <motion.div
                                            initial="initial"
                                            animate="in"
                                            exit="out"
                                            variants={editVariants}
                                            transition={editTransition}
                                            className="expense-item--edit"
                                        >
                                            <span className="edit-element">
                                                        <MouseOverLabel 
                                                            label="Edit"
                                                            labelClass="edit-label rmlab"
                                                            visibleClass="vis"
                                                            hiddenClass="hid"
                                                            
                                                        >
                                                <div onClick={openEditModalHandler} className="wrench edit-item-ani">
                                                <img alt="" className="edit-element--img" src={wrench}></img></div>
                                                        </MouseOverLabel>  

                                                        <MouseOverLabel 
                                                            label="Delete"
                                                            labelClass="edit-label"
                                                            visibleClass="vis"
                                                            hiddenClass="hid"
                                                        >
                                                <div onClick={openDeleteModalHandler} className="remove edit-item-ani">
                                                <img alt="" className="edit-element--img" src={remove}></img></div>
                                                    </MouseOverLabel>                                               
                                            </span>

                                    </motion.div>)
                            }
                        }
                    }

                    return (
                        <AnimatePresence
                            key={index}
                            exitBeforeEnter
                        >
                            <motion.li
                                    className="expense-item"
                                    key={index}
                                    style={overflowHide}
                                    initial="initial"
                                    animate="in"
                                    exit="out"
                                    variants={pageVariants}
                                    transition={pageTransition}
                                    onClick={toggleDeleteItem}
                            >
                                <span id={expense.title} className="expense-title">
                                    <img alt="" src={business} className="zzz"></img>
                                    {expense.title}
                                </span>
                                <span className="expense-ammount">
                                    ${expense.ammount}

                                        {isDelete.clicked && !isEdit &&(
                                            <AnimatePresence
                                                key={expense.title + '1'}
                                                exitBeforeEnter
                                            >
                                                {deleteElement}

                                            </AnimatePresence>)}

                                        {isEdit.clicked &&(
                                            <AnimatePresence
                                                key={expense.title}
                                                exitBeforeEnter
                                            >
                                                {editElement}

                                            </AnimatePresence>)}

                                </span>
                            </motion.li>
                        </AnimatePresence>
                    )
                })
            }
        
        else {
            expenseList = null;
        }
    }
    }

    setExpenses()

    useEffect(() => {
        setExpenses();
        setDeleteModalOpen(false);
    }, [props.userExpense, props.entireBudget])

    useEffect(() => {
        setEditModal()
    }, [displayExpenses, props.userExpense, props.entireBudget])

        

    return (
        
        <div className="dash-left">
    {/* {EVENT SECTION} */}

            {isLoading && <LoadingAnimation loading={isLoading}/>}
            <div className="progress">

                <div className="event">
                    <div onClick={eventModalOpen} className="event-container">
                        <p id="cal" className="dash-right-goals">Events</p>
                        <Calendar2/>
                    </div>
                </div>
                
            </div>


        {/* {CALENDAR MODAL} */}
            <Modal
                show={modalOpen}
                cancel={cancelHandler}
                header={`Month of ${dateNow}`}
                headerClass={"calendar-modal--head"}
                footer={null}
                calendar
            >
                <CalendarModal />

            </Modal>
        {/* {DELETE MODAL} */}

            <MsgModal
                show={deleteModalOpen}
                cancel={cancelHandler}
            >   {deleteModalContent}

            </MsgModal>


        {/* {EDIT MODAL} */}
            <Modal
                show={editModalOpen}
                cancel={cancelHandler}
                header={`Month of ${dateNow}`}
                headerClass={"calendar-modal--head"}
                footer={null}
                onSubmit={submitHandler}

            >
                <ul className="expense-edit-list"
                >
                    {editModalContent}
                </ul>
                

            </Modal>
            
    {/* {EXPENSE LIST} */}
            <div className="expenses expenses--back">
            <Typed
                strings={[
                    'Expenses This Month:',
                    dateNow]}
                    typeSpeed={40}
                    backSpeed={50}
                    backDelay={6000}
                    className="self-typed"
                    loopCount={0}
                    showCursor
                    style={{fontFamily: 'inherit'}}
                    loop ></Typed> <br/>

                {auth.isLoggedIn && <NavLink to={`/${auth.userId}/history`} className="btn history-btn signup signup-btn">View expense history...</NavLink>}

                <ul className="expense-list">
                    {expenseList}                   
                </ul>               
            </div>                                        
        </div>
    )
}

export default DashLeft
