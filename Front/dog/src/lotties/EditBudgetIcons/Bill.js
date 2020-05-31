import React, { useEffect, useState } from 'react'
import Lottie from 'react-lottie';
import animationData from './bill.json';
import lottie from 'lottie-web';

const ExpenseIcon = () => {
    let _lottieHeartRef;
    const [isVis, setIsVis] = useState(false)
    
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
            
            setIsVis(false)
            lottie.setDirection(-1)

        }, 50);
    }

        const mouseOverHandler = (event) => {
            setIsVis(true)
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
            <div className="spin lotto" onMouseOver={() => setIsVis(true)} onMouseLeave={mouseLeaveHandler} onMouseEnter={mouseOverHandler}>
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            height={40}
                            width={40}
                            isClickToPauseDisabled={true}


                            />
                            <span className={`lotto-label ${isVis ? 'vis' : 'hid'}`}>Icon Label</span>

            </div>

            
        )
    
}

export default ExpenseIcon;