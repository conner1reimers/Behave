import React, { useContext, useEffect, useState, Fragment } from 'react'
import Typed from 'react-typed';
import { motion, AnimatePresence } from 'framer-motion';
import ToDoSingle from './ToDoSingle';
import { useHttpClient } from '../../../util/hooks/http-hook';
import { AuthContext } from '../../../util/context/auth-context';
import { BudgetContext } from '../../../util/context/budget-context';
import tic from './tick.svg'
import nope from './close.svg'
import MouseOverLabel from '../../../util/MouseOverLabel';
import ErrorModal from '../../ErrorModal/ErrorModal';


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
        x: '6000%'


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
    mass: 5.3,
    damping: 100,
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
    }
    
    const toggleEditItem = (event, id) => {
        event.preventDefault();
    }

    const cancelHandlr = (event) => {
        event.cancelBubble = true
        event.stopPropagation()

    }

    const deleteTodo = async (event) => {
        event.cancelBubble = true
        event.stopPropagation()
        event.preventDefault();
        console.log(isDelete)
        let response;
        try {
            response = await sendRequest(`http://localhost:5000/api/todo/${isDelete.id}`, 'DELETE')
            console.log(response);
            

            // setMonthEvents((prevState) => {
            //     let curDate = parseInt(`${monthChosen}${yearChosen}`);
            //     let day = parseInt(eventEdit.event.day);
            //     prevState[curDate][day] = prevState[curDate][day].filter((el) => {
            //         return el.id !== deleteId
            //     })
            //     return {
            //         ...prevState
            //     }            
            // });

            // setEventEdit({
            //     clicked: false,
            //     event: {}
            // });
            // setEditEventFurther(false);
        } catch (err) {}
    }


    let todos;
    console.log(props.todos)

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
                                        <h1 className="todo-itemz--deleteHead">Finished?</h1>
                                        <div className="checkmark--box">

                                               <div
                                                    onClick={deleteTodo}
                                            ><MouseOverLabel
                                            label="Delete Todo"
                                            labelClass="edit-label checkmark--label"
                                            visibleClass="vis"
                                            hiddenClass="hid"
                                        >
                                                    <img alt="" className="pen2 checkmark checkmark--1" src={nope}></img>
                                                    </MouseOverLabel>
                                                </div>
                                            

                                             <div
                                                    onClick={cancelHandlr}
                                            >
                                                  <MouseOverLabel
                                                label="Check Off"
                                                labelClass="edit-label checkmark--label-2"
                                                visibleClass="vis"
                                                hiddenClass="hid"
                                            >
                                                    <img alt="" className="pen2 checkmark checkmark--2" src={tic}></img>
                                                    </MouseOverLabel>
                                                </div>
                                            
                                        </div>

                                    </motion.div>)
                            }
                        }
                    }
                   
                    return (
                        <AnimatePresence exitBeforeEnter
                        key={todo._id}
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
        <Fragment>
            <ErrorModal error={error} clearError={clearError}/>
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
        </Fragment>
    )
}

export default TodoItem
