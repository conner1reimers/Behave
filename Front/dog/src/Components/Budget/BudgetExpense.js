import React, { useEffect } from 'react'
import { useForm } from '../../util/hooks/useForm';
import Input from '../../shared/UIElements/Input/Input';
import { VALIDATOR_NUMBER, VALIDATOR_REQUIRE, VALIDATOR_NONE } from '../../util/validators';


const BudgetExpense = (props) => {
    
    const [formState, inputHandler] = useForm({
        "expense": {
            value: '',
            isValid: false
        },
        "expense-category": {
            value: 'bills',
            isValid: true
        },
        "expense-description": {
            value: '',
            isValid: false
        },
    }, false);

    useEffect(() => {
        props.passData(formState)
    },[formState])


    return (
        <div className="budget-maker">
                <Input 
                    name="How Much Did You Spend?"
                    id="expense"
                    onInput={inputHandler}
                    validator={VALIDATOR_NUMBER()}
                    errorText="thats not a number"
                    type="text"
                    class="budget-input"
                    errorClass="error-notNum"
                />
                <Input 
                    name="Category"
                    id="category"
                    dropdownClass="budget-dropdown"
                    cat="expense"
                    onInput={inputHandler}
                    validator={VALIDATOR_NONE()}
                    type="input-options"
                    optionClass="budget-option"
                />
                <Input 
                    name="Describe it (Optional)"
                    id="description"
                    onInput={inputHandler}
                    type="text"
                    class="budget-desc"
                    validator={VALIDATOR_NONE()}
                />
        </div>
    )
}

export default BudgetExpense
