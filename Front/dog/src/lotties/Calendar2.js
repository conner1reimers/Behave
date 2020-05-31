import React from 'react'
import Lottie from 'react-lottie';
import animationData from './redCalendar.json';

const Bulb = () => {
    let _lottieHeartRef;

    
    const onRefLottie = (ref) => {
        _lottieHeartRef = ref;
    } 
    

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
        };
        return (
                            <span className="calendar"><Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            isClickToPauseDisabled={true}
                           
                            /></span>


            
        )
    
}

export default Bulb;