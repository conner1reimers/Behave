import React, { useEffect, useState } from 'react'
import Lottie from 'react-lottie';
import animationData from './potion.json';
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
            <div className="budget-btns pot" >
                            <div className="btn-budget-container">
                                <button type="button" onMouseLeave={mouseLeaveHandler} onMouseEnter={mouseOverHandler} onClick={props.editBudgetToggle} className="btn btn-budget">Edit your budget</button>
                                <div className='potion'>
                                    <Lottie
                                ref={onRefLottie}
                                options={defaultOptions}
                                height={60}
                                width={60}
                                isClickToPauseDisabled={true}
                                />
                                </div>
                            </div>
                            
            </div>

            
        )
    
}

export default Potion;