import React, { useContext, useCallback, useState, useEffect } from 'react'
import { useForm } from '../../util/hooks/useForm'
import Input from '../UIElements/Input/Input'
import { VALIDATOR_REQUIRE, VALIDATOR_NONE } from '../../util/validators';
import TodoItem from './Todo/TodoItem';
import TodoLottie from '../../lotties/todo/TodoLottie'
import { useHttpClient } from '../../util/hooks/http-hook';
import { AuthContext } from '../../util/context/auth-context';
import getMonthYear from '../../util/getMonthYear';
import ErrorModal from '../ErrorModal/ErrorModal';
import LoadingAnimation from '../../lotties/LoadingAnimation/LoadingAnimation';
import { BudgetContext } from '../../util/context/budget-context';
import { ResetContext } from '../../util/context/reset-context';
import { ReactComponent as BellIcon } from './icons/bell.svg';
import { ReactComponent as ArrowIcon } from './icons/arrow.svg';
import { ReactComponent as BoltIcon } from './icons/bolt.svg';
import { ReactComponent as CarotIcon } from './icons/caret.svg';
import { ReactComponent as CogIcon } from './icons/cog.svg';
import { AnimatePresence, motion } from 'framer-motion';
import {CSSTransition} from 'react-transition-group';

const Features = (props) => {

    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const budget = useContext(BudgetContext)
    const auth = useContext(AuthContext);
    const reset = useContext(ResetContext)

    const [userTodos, setUserTodos] = useState(null);
    

    const [formState, inputHandler] = useForm({
        task: {value: '', isValid: false},
        urgency: {value: 'important', isValid: true},
        time: {value: 'today', isValid: true}
        
    }, false);

    const curMonth = getMonthYear();

    const fetchTodos = useCallback(async () => {
        if (auth.isLoggedIn) {
            let response;
            try {
                response = await sendRequest(`http://localhost:5000/api/todo/${auth.userId}`)
                
                setUserTodos(response.todos)
        } catch (err) {}}
    }, [auth.isLoggedIn, auth.userId, sendRequest]);

    useEffect(() => {
        fetchTodos()
    }, [])
    
    const todoSubmit = async (event) => {
        event.preventDefault();

        let response;
        try {
            response = await sendRequest('http://localhost:5000/api/todo',
            'POST',
            JSON.stringify({
                task: formState.inputs.task.value,
                urgency: formState.inputs.urgency.value,
                time: formState.inputs.time.value,
                month: curMonth,
                creator: auth.userId,

            }),
            {'Content-Type': 'application/json'});
            let todo = response.todo;
            let userTodos = budget.todos

            userTodos.push(todo)
            budget.setTodos(userTodos);
            reset.forceUpdate()
        } catch (err) {}
    }

    const [open, setOpen] = useState(false);


    function NavBar(props) {

        return (
            <nav className="navbar">
                <ul className="navbar-nav"> {props.children} </ul>
            </nav>
        )
    }

    function NavItem(props) {
        
        return (
            <li className="nav-item">
                <a href="#" className="icon-button" onClick={() => {props.openMenu && setOpen((prevState) => !prevState)}}>
                    {props.icon}
                </a>

                {open && props.children}
            </li>
        )
    }

    const pageVariants = {
        initial: {
            translateX: "-50%",
            scale: 1,
            opacity: 1,
    
    
        },
        out: {
    
            translateX: 0,
            scale: 0,
            opacity: 0,
    
        },
        in: {
            translateX: 0,
            scale: 1,
            opacity: 1,
    
    
        }
    }

    const pageTransition = {
        type: 'spring',
        mass: 2.5,
        damping: 40,
        stiffness: 600
        
    }


    function DropdownMenu(props) {
        const [activeMenu, setActiveMenu] = useState('main');
        const [menuHeight, setMenuHeight] = useState(null);

        function calcHeight(el) {
            const height = el.offsetHeight;
            setMenuHeight(height);
        }

        function DropdownItem(props) {

            return (
                <a href="#" className="menu-item" onClick={() => {props.goToMenu && setActiveMenu(props.goToMenu)}}>

                    {props.leftIcon && <span className="icon-button">{props.leftIcon}</span>}

                    {props.children}

                    {props.rightIcon && <span className="icon-button icon-right">{props.rightIcon}</span>}

                </a>
            )
        }

        return (
            <AnimatePresence exitBeforeEnter>
                <motion.div 
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition} 
                    className="nav-dropdown"
                    style={{
                        height: menuHeight
                    }}
                >
                    <CSSTransition
                        in={activeMenu === 'main'}
                        unmountOnExit
                        timeout={500}
                        classNames="menu-primary"
                        onEnter={calcHeight}
                    >
                        <div className="menu">
                            <DropdownItem goToMenu="settings">My Profile</DropdownItem>
                            <DropdownItem goToMenu="settings" leftIcon={<CarotIcon/>}>Left Profile</DropdownItem>
                            <DropdownItem goToMenu="settings" leftIcon={<CogIcon/>} rightIcon={<CarotIcon/>}>Right Profile</DropdownItem>
                        </div>
                    </CSSTransition>

                    <CSSTransition
                        in={activeMenu === 'settings'}
                        unmountOnExit
                        timeout={500}
                        classNames="menu-secondary"
                        onEnter={calcHeight}

                    >
                        <div className="menu">
                            <DropdownItem goToMenu="main">SETTINGS</DropdownItem>
                            <DropdownItem goToMenu="main" leftIcon={<CarotIcon/>}>SETTINGS</DropdownItem>
                            <DropdownItem goToMenu="main" leftIcon={<CogIcon/>} rightIcon={<CarotIcon/>}>SETTINGS</DropdownItem>
                            <DropdownItem goToMenu="main">SETTINGS</DropdownItem>
                            <DropdownItem goToMenu="main">SETTINGS</DropdownItem>

                        </div>
                    </CSSTransition>

                </motion.div>
            </AnimatePresence>
        )
    }


    const dropdownElement = (
        <NavBar>
            <NavItem icon={<BellIcon/>}/>
            <NavItem icon={<ArrowIcon/>}/>
            <NavItem icon={<BoltIcon/>}/>

            <NavItem openMenu icon={<BellIcon/>}>
                <DropdownMenu/>
            </NavItem>
        </NavBar>
    )

    return (
        <div className="todo">
            
            <div className="todo-contained">
            
                <div className="heading-todo">
                    <h1 className="todo-head">Todo </h1>
                    <TodoLottie/>
                </div>
                
                <ErrorModal error={error} clearError={clearError}/>
                {isLoading && <LoadingAnimation loading={isLoading} />}

                <form onSubmit={todoSubmit} className="todo-form">
                <Input 
                    onInput={inputHandler}
                    validator={VALIDATOR_REQUIRE()}
                    id="time"
                    type="input-options" 
                    dropdownClass="formitem-todo time" 
                    cat="todo-time"/>
                    <Input
                        onInput={inputHandler} 
                        class="formitem-todo task"                    
                        id="task"
                        name="To Do Task..."
                        type="text"
                        validator={VALIDATOR_REQUIRE()}
                        />
                       

                    <Input 
                        onInput={inputHandler}
                        dropdownClass="formitem-todo-dropdown urgency" 
                        type="input-options" 
                        cat="todo-urgency"
                        id="urgency"
                        element="option"
                        type="input-options"
                        validator={VALIDATOR_REQUIRE()}

                        />
                        

                    <button className="btn todo-btn" type="submit"><span className="btn">SUBMIT</span></button>
                </form>
            </div>

            <div className="back">
                <TodoItem todos={userTodos} />
            </div>
        </div>
    )
}

export default Features
