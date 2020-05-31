import React, { useEffect, useState } from 'react'
import Lottie from 'react-lottie';
import animationData from './creditCard.json';
import lottie from 'lottie-web';

const Potion = (props) => {
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
                                <button onMouseLeave={mouseLeaveHandler} onMouseEnter={mouseOverHandler} type="button" onClick={props.editExpenseToggle} className="btn btn-budget">Add Your Expenses</button>
                                <div className='creditCard'>    <Lottie
                                ref={onRefLottie}
                                options={defaultOptions}
                                height={50}
                                width={50}
                                isClickToPauseDisabled={true}
                                />
                                </div>
                            </div>
                            
            </div>

            
        )
    
}

export default Potion;