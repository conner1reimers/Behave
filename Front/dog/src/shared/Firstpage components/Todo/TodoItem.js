import React, { useContext, useEffect, useState } from 'react'
import Typed from 'react-typed';
import { motion, AnimatePresence } from 'framer-motion';
import ToDoSingle from './ToDoSingle';
import { useHttpClient } from '../../../util/hooks/http-hook';
import { AuthContext } from '../../../util/context/auth-context';
import { BudgetContext } from '../../../util/context/budget-context';
import tic from './tick.svg'

const pageVariants = {
    initial: {
        scale: 0.9,
        opacity: 0.5,
        x: '-10vw'
    },
    in: {
        scale: 1,
        opacity: 1,
        x: 0


    },
    out: {
        scale: 0,        
        opacity: 0,
        x: '-100vw'
    }
}

const pageTransition = {
    type: 'spring',
    stiffness: 250,
    damping: 20,
    velocity: 1.2
};


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

const TodoItem = (props) => {
    let toDoList = '';
    let urgencyClass;

    const budget = useContext(BudgetContext);
    const auth = useContext(AuthContext)

    const [isDelete, setIsDelete] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    function formatDate(date) {
        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 1).toString();
        const monthName = {
            1: 'January',
            2: 'Febuary',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December'
        }
        return monthName[month] + ", " + year;
    }

    const dateNow = formatDate(new Date());

    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    // const deleteHandlr = async (id) => {
    //     try {
    //         if (!isLoading) {
    //             props.deleteHandlr(id)
    //             await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/todo/${id}`, 'DELETE', null, {
    //                 Authorization: 'Bearer ' + auth.token
    //             })
    //         }
    //         else {
    //             console.log('SLOW DOWN!')
    //         }
            

    //     } catch(err) {}

    // }


    const deleteHandlr = (event, id) => {
        event.preventDefault();
        
        if (isDelete) {
            if (isDelete.id === id && isDelete.clicked === true) {
                setIsDelete((prevState) => {return {...prevState, clicked: false}});
                setIsEdit(false);
            } else {
                setIsDelete({id: id, clicked: true})
            }
        } else {
            setIsDelete({id, clicked: true});
            setIsEdit(false)
        }
        console.log(isDelete)
    }
    
    const toggleEditItem = (event, id) => {
        event.preventDefault();
        console.log(id)
    }

    let todos;
    const setTodos = () => {
        if (props.todos) {
            todos = props.todos
        } else {
            todos = [{}];
        };

        if (todos.length > 0) {
            toDoList = todos.map((todo, index) => {
                if (todo.urgency === "important") {
                    urgencyClass = "important"
                } else if (todo.urgency === "medium") {
                    urgencyClass = "medium"
                } else {
                    urgencyClass = "go"
                }
                if(todo.urgency !== '') {
                    let deleteElement;
                    if (isDelete) {
                        if (isDelete.id === todo.id) {
                            if (isDelete.clicked === true) {

                                deleteElement = (
                                    <motion.div
                                        initial="initial"
                                        animate="in"
                                        exit="out"
                                        variants={deleteVariants}
                                        transition={deleteTransition}
                                        className="todo-itemz--delete"
                                        onClick={(event) => toggleEditItem(event, todo.id)}
                                    >
                                        <h1 className="todo-itemz--deleteHead">Have you finished this task?</h1>
                                        <div className="checkmark--box">
                                            <img alt="" className="pen1 checkmark checkmark--1" src={tic}></img>
                                            <img alt="" className="pen2 checkmark checkmark--2" src={tic}></img>
                                        </div>

                                    </motion.div>)
                            }
                        }
                    }

                    return (
                        <AnimatePresence exitBeforeEnter
                        key={index}
                        >
                            <motion.li 
                                animate="in"
                                initial="initial"
                                exit="out"
                                variants={pageVariants}
                                transition={pageTransition}                      
                                onClick={(event) => deleteHandlr(event, todo.id)}
                                className="todo-itemz"
                                >
                                    <ToDoSingle task={todo.task} urgency={todo.urgency} urgencyClass={urgencyClass} />
                                    {isDelete.clicked && !isEdit &&(
                                            <AnimatePresence
                                                key={todo.id}
                                                exitBeforeEnter
                                            >
                                                {deleteElement}

                                            </AnimatePresence>)}
                            </motion.li>
                        </AnimatePresence>
                    )
                }
                
            })
        } else {
            toDoList = null
        }
    }

    setTodos();
    

    useEffect(() => {
        setTodos();
    }, [props.todos, todos])

    return (
        <div className="todo-under">
            <Typed
                strings={[
                    'To Do Today:',
                    dateNow]}
                    typeSpeed={40}
                    backSpeed={50}
                    backDelay={3000}
                    className="self-typed todo-typed"
                    loopCount={0}
                    showCursor
                    loop ></Typed>
            
            <ul className="todo-list">
                {toDoList}
            </ul>
        </div>
    )
}

export default TodoItem
