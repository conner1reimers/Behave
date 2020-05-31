import React, { Fragment, useReducer, useEffect, useRef, useState } from 'react'
import {validate} from '../../../util/validators';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import strawberry from './img/strawberry.png';
import drop from './img/drop.png';
import hand from './img/hand.png';
import trade from './img/trade.png';
import animal from './img/animal.png';
import envelope from './img/envelope.png';
import headphone from './img/headphone.png';
import popcorn from './img/popcorn.png';
import pharmacy from './img/pharmacy.png';
import babyGirl from './img/baby-girl.png';







const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            };
        default:
            return state
    }
};

const transition = { duration: .3, loop: false, ease: 'easeIn' };

const Input = (props) => {
    let customBackgroundRef;
    let dropDownRef;
    let customInputRef;


    const onBackgroundRef = (ref) => {
        customBackgroundRef = ref;
    } 
    const onDropdownRef = (ref) => {
        dropDownRef = ref;
    } 
    const onCustomInputRef = (ref) => {
        customInputRef = ref;
    } 



    const animation = useAnimation()

    const toggleAnimation = () => {
        animation.start({
            scale: [1, 1.05, 1],
            x: ['0%', '2%', '0%', '-2%', '2%', '0%'],
            borderColor: ['#fff', '#f00', '#f455'],
            rotate: [0, .3, 0],
            transition
        })
    }

    let defaults;

    if (props.cat) {
        if (props.cat === "expense") {
            defaults = {
                value: 'bills',
                isValid: true
            }
        } else if (props.cat === "income") {
            defaults = {
                value: 'bills',
                isValid: true
            }
        } else if (props.cat === "todo-time") {
            defaults = {
                value: 'today',
                isValid: true
            }
        } else if (props.cat === "todo-urgency") {
            defaults = {
                value: 'important',
                isValid: true
            }
        }
    } else {
        defaults = {
            value: '',
            isValid: false
        }
    }


    const [inputState, dispatch] = useReducer(inputReducer, {
        isTouched: false,
        value: defaults.value,
        isValid: defaults.isValid,
        isMatchedPass: true
    });

    const { id, onInput } = props
    const { value, isValid, isMatchedPass } = inputState



    const changeHandler = (event, checked) => {
        dispatch({type: 'CHANGE', val: event.target.value, validators: props.validator})

        
        
    };

    const touchHandler = () => {
        dispatch({type: 'TOUCH'})
    }

    useEffect(() => {
        onInput(id, value, isValid)

    }, [id, value, isValid, onInput])

    let classes;

    if (!inputState.isValid && inputState.isTouched) {
        if(inputState.value.length <= 1) {
            toggleAnimation()
        }
        
        classes = 'inv'
    }
    if (inputState.isValid) {
        classes = 'val'
    }


    const addDropdownClass = (event) => {
        let target = event.target;
        if (target) {
            if (target.nodeName.toLowerCase() === "label" ) {
                target.parentElement.classList.toggle("active")
                
            }
        }
    }






    let element;

    if (props.type === 'text') {
        element = (
            <motion.div
                animate={animation}
                key={props.id} 
                className={`input ${props.class}`}
            >
    
                <input
                onKeyUp={changeHandler}
                onFocusCapture={touchHandler}
                className={`form-input ${props.class} ${classes}`}
                type="text"
                id={id}
                placeholder={props.name}
                
                />
                {!inputState.isValid && inputState.isTouched ? <p className={`error-text ${props.errorClass}`}>{props.errorText}</p> : null}
                
            </motion.div>
        )
    }  else if (props.type === "input-options") {

        if (props.cat === "income") {
            element = (
                <Fragment>
                    <div 
                        className={`custom-dropdown ${props.dropdownClass}`}
                        id="customDropdown"
                        ref={onDropdownRef}
                        onClick={addDropdownClass}    
                    >
                        <input
                        
                            className={`custom-input`}
                            type="radio"
                            name='dropdown'
                            id='salary'
                            value="salary"
                            ref={onCustomInputRef}
                            onClick={changeHandler}
                            defaultChecked
                            
                            // checked={salarCheck}
                        />
                        <label htmlFor="salary">Salary <img className="straw" src={envelope}/></label>

                        <input  value="side" onClick={changeHandler} ref={onCustomInputRef}  type="radio" id="side" name="dropdown" className="custom-input" />
                        <label htmlFor="side">Sidehustle <img className="straw" src={animal}/></label>

                        <input  value="stock" onClick={changeHandler} ref={onCustomInputRef}  type="radio" id="stock" name="dropdown" className="custom-input" />
                        <label htmlFor="stock">Stocks <img className="straw" src={hand}/></label>

                        <input value="trade" onClick={changeHandler} ref={onCustomInputRef}  type="radio" id="trade" name="dropdown" className="custom-input" />
                        <label  htmlFor="trade">Trading <img className="straw" src={trade}/></label>

                        <input value="other" onClick={changeHandler} ref={onCustomInputRef}  type="radio" id="other" name="dropdown" className="custom-input" />
                        <label htmlFor="other">Other <img className="straw" src={drop}/></label>
    
                    </div>

                </Fragment>)



        } else if (props.cat === "expense") {
            element = (
                <Fragment>
                    <div 
                        className={`custom-dropdown ${props.dropdownClass}`}
                        id="customDropdown"
                        ref={onDropdownRef}
                        onClick={addDropdownClass}    
                    >
                        <input
                        
                            className={`custom-input`}
                            type="radio"
                            name='dropdown'
                            id='bills'
                            value="bills"
                            ref={onCustomInputRef}
                            defaultChecked
                            onClick={changeHandler}
                            
                            // checked={salarCheck}
                        />
                        <label htmlFor="bills">Bills <img className="straw" src={envelope}/></label>

                        <input  value="food" onClick={changeHandler}  ref={onCustomInputRef}  type="radio" id="food" name="dropdown" className="custom-input" />
                        <label  htmlFor="food">Food <img className="straw" src={strawberry}/></label>

                        <input value="entertainment" onClick={changeHandler} ref={onCustomInputRef}  type="radio" id="entertainment" name="dropdown" className="custom-input" />
                        <label htmlFor="entertainment">Entertainment <img className="straw" src={popcorn}/></label>
                        <input  value="supplies" onClick={changeHandler} ref={onCustomInputRef}  type="radio" id="supplies" name="dropdown" className="custom-input" />
                        <label  htmlFor="supplies">Supplies <img className="straw" src={pharmacy}/></label>

                        <input value="tech" onClick={changeHandler} ref={onCustomInputRef}  type="radio" id="tech" name="dropdown" className="custom-input" />
                        <label htmlFor="tech">Technology <img className="straw" src={headphone}/></label>
                        
                        <input value="kids" onClick={changeHandler} ref={onCustomInputRef}  type="radio" id="kids" name="dropdown" className="custom-input" />
                        <label htmlFor="kids">Kids <img className="straw" src={babyGirl}/></label>

                        <input value="other" onClick={changeHandler} ref={onCustomInputRef}  type="radio" id="other" name="dropdown" className="custom-input" />
                        <label htmlFor="other">Other <img className="straw" src={drop}/></label>

                                {/* <option value="1">Category</option>
                                <option value="5">Salary</option>
                                <option value="5">Side money</option>
                                <option value="5">Stocks</option>
                                <option value="5">Trading</option>
                                <option value="5">Other</option> */}
                        
                    </div>

                </Fragment>
                
                        
                )
        } else if (props.cat === "todo-time") {
            element = (
                <form className="radio-todo">
                    <input className="radio-todo--input radio-todo--input--1" defaultChecked id="today" value="today" name="time" style={{marginLeft: '3rem', fontFamily: 'Didact Gothic'}}type="radio"/> 
                    <label className="radio-todo--label" htmlFor="today" style={{marginRight: '3rem', marginLeft: '1rem', fontFamily: 'Didact Gothic'}}><span></span>Today</label>

                    <input className="radio-todo--input radio-todo--input--2" id="week" value="week" name="time" type="radio"/> 
                    <label className="radio-todo--label" htmlFor="week" style={{fontFamily: 'Didact Gothic',  marginLeft: '1rem',}}><span></span>This Week</label>

                    <div className="worm">
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
                        <div className="worm__segment"></div>
	                </div>
                    

                </form>)
        } else if (props.cat === "todo-urgency") {
            element = (
                <Fragment>
                    <div 
                        className={`custom-dropdown ${props.dropdownClass}`}
                        id="customDropdown"
                        ref={onDropdownRef}
                        onClick={addDropdownClass}    
                    >
                        <input
                        
                            className={`custom-input`}
                            type="radio"
                            name='dropdown'
                            id='important'
                            value="important"
                            ref={onCustomInputRef}
                            defaultChecked
                            onClick={changeHandler}
                            
                            // checked={salarCheck}
                        />
                        <label htmlFor="important">Important <img className="straw" src={envelope}/></label>

                        <input value="medium" onClick={changeHandler} ref={onCustomInputRef}  type="radio" id="medium" name="dropdown" className="custom-input" />
                        <label htmlFor="medium">Medium Importance <img className="straw" src={animal}/></label>

                        <input value="unimportant" onClick={changeHandler} ref={onCustomInputRef}  type="radio" id="unimportant" name="dropdown" className="custom-input" />
                        <label htmlFor="unimportant">Unimportant <img className="straw" src={hand}/></label>

                        
    
                    </div>

                </Fragment>)
        }
        
    }




    return element ? element : null
}

export default Input


                // <div className="selectdiv">
                //     <select
                    
                //         className={`form-input ${classes} ${props.optionClass}`}
                //         type="option"
                //         id={id}
                //         name={props.name}
                //         value={inputState.value}
                //         onChange={changeHandler}
                //     >
                //             <option value="1">Category</option>
                //             <option value="2">Bills</option>
                //             <option style={{backgroundImage: 'url(./img/strawberry.png)'}} className="food" value="5">Food</option>
                //             <option value="5">Supplies</option>
                //             <option value="5">Entertainment</option>
                //             <option value="5">Technology</option>
                //             <option value="5">Kids</option>
                //             <option value="5">Other</option>

                    
                //     </select>
                // </div>