import React, { useEffect, Fragment } from 'react'
import { useForm } from '../../util/hooks/useForm';
import Input from '../../shared/UIElements/Input/Input';
import { VALIDATOR_NUMBER, VALIDATOR_REQUIRE } from '../../util/validators';
import { VALIDATOR_NONE } from '../../util/validators';


const BudgetIncome = (props) => {


    const [formState, inputHandler] = useForm({
        "income": {
            value: '',
            isValid: false
        },
        "income-category": {
            value: 'salary',
            isValid: true
        },
        "income-description": {
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
                        name="How much Did you Make?"
                        id="income"
                        onInput={inputHandler}
                        validator={VALIDATOR_NUMBER()}
                        errorText="thats not a number"
                        type="text"
                        class="budget-input"
                        errorClass="error-notNum"
                    />
                    <Input 
                        name="Category"
                        dropdownClass="budget-dropdown"
                        id="category"
                        cat="income"
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

export default BudgetIncome
