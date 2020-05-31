import React, { useEffect } from 'react'
import { useForm } from '../../util/hooks/useForm';
import Input from '../../shared/UIElements/Input/Input';
import { VALIDATOR_NUMBER } from '../../util/validators';


const BudgetMonthly = (props) => {

    
    const [formState, inputHandler] = useForm({
        ammount: {
            value: '',
            isValid: false
        }
    }, false);

    useEffect(() => {
        props.passData(formState)
    },[formState])

    

    
    return (
        <div className="budget-maker">
                <Input 
                    name="Budget for this month"
                    id="ammount"
                    onInput={inputHandler}
                    validator={VALIDATOR_NUMBER()}
                    type="text"
                    class="budget-month"
                    errorText="thats not a number"
                    errorClass="error-notNum"
                />
        </div>
    )
}

export default BudgetMonthly
