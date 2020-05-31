import React, { useEffect, useContext, useState, Fragment } from 'react'
import Typed from 'react-typed';
import Calendar2 from '../../../lotties/Calendar2';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../../util/context/auth-context';
import business from './businesss.png';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import Modal from '../../UIElements/Modal/Modal';
import CalendarModal from '../../../Components/Calendar/CalendarModal';
import getMonthYear from '../../../util/getMonthYear';
import { BudgetContext } from '../../../util/context/budget-context';
import pencil from './pencil.svg';
import remove from './remove.svg';
import wrench from './wrench.svg';
import MouseOverLabel from '../../../util/MouseOverLabel';
import MsgModal from '../../UIElements/Modal/MsgModal';
import {useHttpClient} from '../../../util/hooks/http-hook';
import LoadingAnimation from '../../../lotties/LoadingAnimation/LoadingAnimation';

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




const DashLeft = (props) => {
    const dateNow = getMonthYear();

    const [modalOpen, setModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteName, setDeleteName] = useState(null)
    
    const {isLoading, error, sendRequest, clearError} = useHttpClient()
    
    const auth = useContext(AuthContext);
    const budget = useContext(BudgetContext)

    const eventModalOpen = () => {
        if(auth.isLoggedIn) {
            setModalOpen(true)
        } else {
            props.toggle()
        }
    }
    
    const openEditModalHandler = (event) => {
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
            let expense = budget.expense            
            let newExpenses = expense.filter((el) => {
                return el.title !== deleteName
            })
            budget.setExp(newExpenses)
            cancelHandler()
        } catch (err) {}


    }

    const overflowHide = isEdit ? {
        overflow: 'visible'
    } : {
        overflow: 'hidden'
    }

    const toggleDeleteItem = (event) => {
        if (isDelete) {
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

    const editModalContent = (
        <div>
            
        </div>
    )

    const deleteModalContent = (
        <Fragment>
            <h1  className="delete-modal--head">You sure you want to delete this expense(s)?</h1>
            <div className="delete-modal--btns">
                <button onClick={deleteHandler} id="btn" className="delete-modal--btn btn btn--yes btn-err" type="button">YES</button>
                <button onClick={cancelHandler}  id="btn" className="delete-modal--btn btn btn-err" type="button">CANCEL</button>
            </div>
            <p className="delete-modal--bottomtext">Choose to <button type="button" className="btn delete-modal--edit">edit</button> instead</p>
        </Fragment>
    )

    const setExpenses = () => {
        
        if (props.userExpense) {
            expenses = props.userExpense;
        } else {
            expenses = [{}]
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
    }, [props.userExpense, expenses])

        

    return (
        <div className="dash-left">
            {isLoading && <LoadingAnimation loading={isLoading}/>}
            <div className="progress">

                <div className="event">
                    <div onClick={eventModalOpen} className="event-container">
                        <p id="cal" className="dash-right-goals">Events</p>
                        <Calendar2/>
                    </div>
                </div>
                
            </div>

            <Modal
                show={modalOpen}
                cancel={cancelHandler}
                header={<h2 className="calendar-modal--head">Month of {dateNow}</h2>}
                footer={null}
            >
                <CalendarModal />

            </Modal>

            <MsgModal
                show={deleteModalOpen}
                cancel={cancelHandler}
            >   {deleteModalContent}

            </MsgModal>

            <Modal
                show={editModalOpen}
                cancel={cancelHandler}
                header={<h2 className="calendar-modal--head">Month of {dateNow}</h2>}
                footer={null}
            >   {editModalContent}

            </Modal>
            
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
