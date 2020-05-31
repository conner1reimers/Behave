import React, { useEffect, useState } from 'react'
import Lottie from 'react-lottie';
import animationData from './piggyBank.json';
import lottie from 'lottie-web';

const ExpenseIcon = (props) => {
    let _lottieHeartRef;
    
    const onRefLottie = (ref) => {
        _lottieHeartRef = ref;
    } 
    


    const defaultOptions = {
        loop: false,
        autoplay: false,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
        };

    const complica = async () => {
        setTimeout(() => { 
            lottie.setDirection(-1)
        }, 50);
    }

        const mouseOverHandler = (event) => {
            _lottieHeartRef && _lottieHeartRef.setDirection(1)
            _lottieHeartRef && _lottieHeartRef.play()  
            
        }
        const mouseLeaveHandler = (event) => {
            _lottieHeartRef.setDirection(-1)
            _lottieHeartRef.play()
            complica()
            
        }

        
        useEffect(() => {
            mouseLeaveHandler()
        }, [])
        


        return (
            <div className="budget-btns" >
                            <div className="btn-budget-container">
                                <button 
                                    type="button" 
                                    onMouseLeave={mouseLeaveHandler} 
                                    onMouseEnter={mouseOverHandler} 
                                    onClick={props.editIncomeToggle} 
                                    className="btn btn-budget">Add Your Income
                                </button>

                                <div className="piggy">   
                                    <Lottie
                                        ref={onRefLottie}
                                        options={defaultOptions}
                                        height={40}
                                        width={40}
                                        isClickToPauseDisabled={true}
                                />
                                </div>
                            </div>
                            
            </div>

            
        )
    
}

export default ExpenseIcon;