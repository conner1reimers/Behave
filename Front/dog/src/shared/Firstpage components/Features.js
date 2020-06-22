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
                        dropdownClass="formitem-todo urgency" 
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
