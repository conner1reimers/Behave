import React, { useState, useEffect, useContext, Fragment, useCallback, useRef } from 'react'
import Modal from '../shared/UIElements/Modal/Modal';
import Input from '../shared/UIElements/Input/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_EMAIL } from '../util/validators';
import { useForm } from '../util/hooks/useForm';
import { useHttpClient } from '../util/hooks/http-hook';
import { AuthContext } from '../util/context/auth-context';
import ErrorModal from '../shared/ErrorModal/ErrorModal';
import Media from 'react-media';

const Auth = React.memo((props) => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();


    const [formState, inputHandler, checkPass, setData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        },
        passwordConfirm: {
            value: '',
            isValid: false
        }
    }, false);

    const [isMatchedPass, setIsMatchedPass] = useState(true);
    const [isOnSignupMode, setIsonSignup] = useState(false);
    const [ontoNextSignup, setOntoNextSignup] = useState(false);


    const switchModeHandlr = useCallback(() => {
        if(!isOnSignupMode) {
            setData(
                {   
                    email: {
                        value: formState.inputs.email.value,
                        isValid: formState.inputs.email.isValid
                    },
                    password: {
                        value: '',
                        isValid: false
                    },
                    passwordConfirm: {
                        value: '',
                        isValid: false
                    }
                }, formState.inputs.email.isValid)
        } else {
            setData(
                {
                    email: {
                        value: '',
                        isValid: false
                    },
                    password: {
                        value: '',
                        isValid: false
                    },
                    passwordConfirm: {
                        value: '',
                        isValid: false
                    },
                }, false)
        }
        setIsonSignup((prevState) => !prevState)   
    }, [setIsonSignup])


    const loginFooter = (
        <footer className={`modal-footer`}>
            <button type="submit" className="btn btn-signin">Sign In</button> <br/>
            <span className="hereB4-text">Never been here before? <button type="button" onClick={switchModeHandlr} className="btn signup-btn"> SIGN UP </button></span>
        </footer>)
    
    const signUpFooter = (
        <footer className={`modal-footer`}>
            <button type="submit" className="btn btn-signin">Continue</button> <br/>
            <span className="B4-text">Already have an account? <button type="button" onClick={switchModeHandlr} className="btn signup-btn"> Back to Login </button></span>
            <br/>
        </footer>)
    

    const submitHandlr = useCallback(async (event) => {
        event.preventDefault();
        if (!isOnSignupMode) {
            try {
                const responseData = await sendRequest('http://localhost:5000/api/users/login', 'POST',
                JSON.stringify({
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                }),
                {'Content-Type': 'application/json'});
                auth.login(responseData.userId, responseData.token)
                props.setOpenLogin(false)

                
            } catch (err) {}
        }

        if (isOnSignupMode && formState.inputs.email.isValid && !ontoNextSignup) {
            signUpHandler(formState.inputs.email.value)

        } else if (isOnSignupMode && formState.isValid && ontoNextSignup) {
            if (!formState.isMatchedPass) {
                setIsMatchedPass(false)
            }
            else {
                try {
                    const responseData = await sendRequest('http://localhost:5000/api/users/signup', 'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {'Content-Type': 'application/json'});

                    auth.login(responseData.userId, responseData.token)
                    props.setOpenLogin(false)
                    
                } catch (err) {}
            }
        }
        

    }, [isOnSignupMode, formState])

    const signUpHandler = useCallback((email) => {
        console.log('onto the next')
        setOntoNextSignup((prevState) => !prevState)
        setData({
            email: {
                value: email,
                isValid: true
            },
            password: {
                value: '',
                isValid: false
            },
            passwordConfirm: {
                value: '',
                isValid: false,
            }
            
        }, false)
    }, [setOntoNextSignup])

    const cancelHandlr = useCallback((eve) => {
        props.toggleLogin(eve);
        setOntoNextSignup((prevState) => !prevState);
        setIsMatchedPass(true)
    }, [])

    const ontoNextSignupFooter = (
        <footer className={`modal-footer`}>
            <button type="submit" className="btn btn-signin">Continue</button> <br/>
            <span className="B4-text">Change your mind? <button type="button" onClick={cancelHandlr} className="btn signup-btn"> Cancel </button></span>
            <br/>
        </footer>)


    let modalInfo;
    modalInfo = isOnSignupMode ? (
        <Modal 
                cancel={props.toggleLogin} 
                show={props.openLogin}
                art
                header="Want to become a member? Sign Up below!"
                footer={signUpFooter}
                img='auth'
                onSubmit={submitHandlr}
                    >
                        <Input 
                            name="Email" 
                            id="email"
                            validator={VALIDATOR_EMAIL()}
                            onInput={inputHandler}
                            errorText="Please enter a valid Email"
                            type="text"
                            class="auth-form"


                        />
                    </Modal>
    ) : (
        <Modal 
                cancel={props.toggleLogin} 
                show={props.openLogin}
                art
                header="Sign In"
                footer={loginFooter}
                img='auth'
                onSubmit={submitHandlr}
                    >
                        <Input 
                            name="Email" 
                            id="email"
                            validator={VALIDATOR_EMAIL()}
                            onInput={inputHandler}
                            errorText="Please enter a valid Email"
                            type="text"
                            class="auth-form"



                        />
                        <Input 
                            name="Password" 
                            id="password"
                            validator={VALIDATOR_MINLENGTH(6)}
                            onInput={inputHandler}
                            type="text"
                            errorText="Please enter a valid password... Must be atleast 6 characters"
                            class="auth-form"


                        />
                    </Modal>
    )

    useEffect(() => {
        if(formState.inputs.passwordConfirm) {
            checkPass(formState.inputs.password.value, formState.inputs.passwordConfirm.value)
        }

    }, [ontoNextSignup, formState.inputs.password.value, formState.inputs.passwordConfirm.value])

    if(ontoNextSignup){
        modalInfo = (
            <Modal 
                    cancel={props.toggleLogin} 
                    show={props.openLogin}
                    art
                    header="Please choose a password"
                    footer={ontoNextSignupFooter}
                    img='auth'
                    onSubmit={submitHandlr}
                        >
                            <Input 
                                name="Password" 
                                id="password"
                                validator={VALIDATOR_MINLENGTH(6)}
                                onInput={inputHandler}
                                errorText="Please enter a valid password (atleast 6 characters)"
                                type="text"
                                class="auth-form"



                                
                            />
                            <Input 
                                name="Confirm password" 
                                id="passwordConfirm"
                                validator={VALIDATOR_MINLENGTH(6)}
                                onInput={inputHandler}
                                errorText="Please make sure your passwords match"
                                type="text"
                                class="auth-form"



                            />
                        </Modal>
        )
    }

    if (ontoNextSignup && !isMatchedPass){
        modalInfo = (
            <Modal 
                    cancel={props.toggleLogin} 
                    noMatch
                    show={props.openLogin}
                    art
                    headerClass={`inv`}
                    header="Passwords do not match"
                    footer={ontoNextSignupFooter}
                    img='auth'
                    onSubmit={submitHandlr}
                        >
                            <Input 
                                name="Password" 
                                id="password"
                                validator={VALIDATOR_MINLENGTH(6)}
                                onInput={inputHandler}
                                errorText="Please enter a valid password (atleast 6 characters)"
                                type="text"
                                class="auth-form"



                                
                            />
                            <Input 
                                name="Confirm password" 
                                id="passwordConfirm"
                                validator={VALIDATOR_MINLENGTH(6)}
                                onInput={inputHandler}
                                errorText="Please make sure your passwords match"
                                type="text"
                                class="auth-form"



                            />
                        </Modal>
        )
    }
    const renders = useRef(0);
    
    return (
    <Fragment>
        <ErrorModal error={error} clearError={clearError}/>
        <div className="auth-renders">renders: {renders.current++}</div>

        {modalInfo}
    </Fragment>)
})

export default Auth
