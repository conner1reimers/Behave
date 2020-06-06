import { useReducer, useCallback } from "react";


const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            let matchPass = true;
            for (const inputId in state.inputs) {
                let pass;
                let passConfirm;
                if (!state.inputs[inputId]) {
                    continue;
                }
                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid
                }
                else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid
                }
         
            
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {value: action.value, isValid: action.isValid}
                },
                isValid: formIsValid
            };
        case 'SET_DATA':
            return {
                ...state,
                inputs: action.inputs,
                isValid: action.formValidity
            }
        case 'MATCH_CHECK':
            
            return {
                ...state,
                isMatchedPass: (state.inputs.password.value === state.inputs.passwordConfirm.value)
            }

        default:
            return state

    }
}

export const useForm = (initialInputs, initialValidity) => {

    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        //     email: {},
        //     password: {}
        // AKA ^^^
        isValid: initialValidity,
        isMatchedPass: false
    });

    const inputChangeHandler = useCallback((id, value, isValid) => {
            dispatch({
                type: 'INPUT_CHANGE',
                inputId: id,
                value: value,
                isValid: isValid,
                isMatchedPass: undefined
            })
        },
        [],
    );

    const checkPass = useCallback((pass, passConfirm) => {
        dispatch({
            type: 'MATCH_CHECK',
            pass: pass,
            passConfirm: passConfirm
        })
    }, [])


    const setData = useCallback((inputData, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formValidity: formValidity
        })
    }, [])


    return [formState, inputChangeHandler, checkPass, setData];
}