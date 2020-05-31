import React, { useContext } from 'react'
import Typed from 'react-typed';
import { motion, AnimatePresence } from 'framer-motion';
import ToDoSingle from './ToDoSingle';
import { useHttpClient } from '../../../util/hooks/http-hook';
import { AuthContext } from '../../../util/context/auth-context';

 
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


}

const TodoItem = (props) => {
    let toDoList = '';
    let urgencyClass;
    const auth = useContext(AuthContext)


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

    if (props.todos) {
        toDoList = props.todos.map((todo, index) => {
            if (todo.urgency === "important") {
                urgencyClass = "important"
            } else if (todo.urgency === "medium") {
                urgencyClass = "medium"
            } else {
                urgencyClass = "go"
            }
            if(todo.urgency !== '') {
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
                  
                            // onClick={() => deleteHandlr(todo.id)}
                            className="todo-itemz"
                            >
                                <ToDoSingle task={todo.task} urgency={todo.urgency} urgencyClass={urgencyClass} />
                        </motion.li>
                    </AnimatePresence>
                )
            }
            
        })
    }
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
