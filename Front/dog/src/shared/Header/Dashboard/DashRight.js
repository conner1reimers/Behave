import React, { useContext, useState, Fragment, useEffect, useCallback } from 'react';
import Typed from 'react-typed';
import Bulb from '../../../lotties/Bulb';
import Modal from '../../UIElements/Modal/Modal';
import { AuthContext } from '../../../util/context/auth-context';
import Input from '../../UIElements/Input/Input';
import { useForm } from '../../../util/hooks/useForm';
import { AnimatePresence, motion } from 'framer-motion';
import business from './dashLeftImgs/businesss.png';
import { VALIDATOR_REQUIRE } from '../../../util/validators';
import getMonthYear from '../../../util/getMonthYear';
import Trophy from '../../../lotties/Trophy/Trophy';
import GoalModalItem from '../../../Components/GoalModal/GoalModalItem';
import LoadingAnimation from '../../../lotties/LoadingAnimation/LoadingAnimation';
import { useHttpClient } from '../../../util/hooks/http-hook';
import ErrorModal from '../../ErrorModal/ErrorModal';
import { NavLink } from 'react-router-dom';


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


const DashRight = (props) => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient()

    const [, updateState] = useState();


    const [formState, inputHandler] = useForm({
        goal: {value: '', isValid: false}
    })

    const dateNow = getMonthYear();

    const auth = useContext(AuthContext)
    const [modalOpen, setModalOpen] = useState(false)
    const [todoSelect, setTodoSelect] = useState(null);




    const goalsModalOpen = () => {
        if(auth.isLoggedIn) {
            setModalOpen((prevState) => !prevState)
        } else {
            props.toggle()
        }
    }


    const cancelHandler = () => {
        setModalOpen(false);
    }

    const selectTodo = (event, todoId) => {
        if (todoSelect) {
                if (todoSelect.id === todoId) {
                    
                } else {
                    setTodoSelect()
                }
        } else{
            setTodoSelect({
                id: todoId,
                clicked: true
            })
        }
    }


    let todos;
    let todoList;
    const setTodos = () => {
        if (props.todos) {
            todos = props.todos;
        } else {
            todos = []
        }
    
        if(todos) {
            if (todos.length > 0) {
                todoList = todos.map((todo, index) => {
                    return (
                        <AnimatePresence
                            key={index}
                            exitBeforeEnter
                        >
                            <motion.li
                                    className="todo-item"
                                    key={index}
                                    initial="initial"
                                    animate="in"
                                    exit="out"
                                    variants={pageVariants}
                                    transition={pageTransition}
                            >
                                <span id={index} className="todo-title">
                                    <img alt="" src={business} className="zzz"></img>
                                    {todo.task}
                                </span>
                                <span className="todo-ammount">
                                    {todo.urgency}
                                </span>

                            </motion.li>
                        </AnimatePresence>
                    )
                })
            }
        
        else {
            todoList = null;
        }
    }}
    let newGoal;



    const goalSubmit = async (event) => {
        event.preventDefault();
        let response

        try {
            response = await sendRequest(
                'http://localhost:5000/api/goals/',
                'POST',
                JSON.stringify({
                    title: formState.inputs.goal.value,
                    chosen: false,
                    creator: auth.userId
                }),
                {'Content-Type': 'application/json'}
                
            )
        newGoal = response.goal
        let goals = props.goals;
        goals.push(newGoal);
        props.setGoals(goals);
        forceUpdate()
        
        } catch (err) {}
    }

    const forceUpdate = useCallback(() => updateState({}), []);

    setTodos();

    useEffect(() => {
        setTodos();
    }, [props.todos])

    


    return (
        <Fragment>
        <ErrorModal error={error} clearError={clearError}/>

        {isLoading && <LoadingAnimation/>}

        <div className="dash-right">

            <div className="goals">
                <div onClick={goalsModalOpen} className="goals-contain">
                    <p id="goal" className="dash-right-goals">Goals  </p>
                    <Bulb/>
                </div> 
                
            </div>

            


            <Modal
                show={modalOpen}
                header={null}
                footer={null}
                cancel={cancelHandler}
                img="bulb"
                onSubmit={goalSubmit}
            >
                <div className="goal-modal">

                    <div className="goal-modal--upper">
                        <h1 className="goal-modal--head--1"> <p>Setup Some Goals</p> <Trophy/> </h1>
                        <Input 
                            type="text" 
                            id="goal"
                            name="goal"
                            onInput={inputHandler}
                            class="goal-modal--input"
                            validator={VALIDATOR_REQUIRE()}
                        />
                        <button className="btn btn-submit btn-goal">Submit Goal</button>
                    </div>

                    <div className="goal-modal--lower">
                        <h3 className="goal-modal--head--2">Which 3 goals would you like to display on your homepage?</h3>
                        
                        <GoalModalItem 
                            setGoals={props.setGoals} 
                            goals={props.goals}
                            goalSubmit={goalSubmit}
                        />
                    </div>
                </div>


            </Modal>

            <div className="expenses right-back">
            <Typed
                strings={[
                    'To Do This Week:',
                    dateNow]}
                    typeSpeed={40}
                    backSpeed={50}
                    backDelay={6000}
                    className="self-typed"
                    loopCount={0}
                    showCursor
                    loop ></Typed> <br/>

                    {auth.isLoggedIn && <NavLink to={`/${auth.userId}/todo`} className="btn signup-btn btn-prod">Todos...</NavLink>}

                <ul style={{marginLeft: '1.5rem'}} className="expense-list">
                    {todoList}
                </ul>
            </div>
        </div>
        </Fragment>
    )
}

export default React.memo(DashRight)
