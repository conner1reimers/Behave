import React, { useContext } from 'react'
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

const Features = (props) => {

    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const auth = useContext(AuthContext);

    const [formState, inputHandler] = useForm({
        task: {value: '', isValid: false},
        urgency: {value: 'important', isValid: true},
        time: {value: 'today', isValid: true}
        
    }, false);

    const curMonth = getMonthYear();

    const todoSubmit = async (event) => {
        event.preventDefault();

        let response;
        console.log(formState)
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
                <TodoItem todos={props.todos} />
            </div>
        </div>
    )
}

export default Features
