import React from 'react'
import Lottie from 'react-lottie';
import animationData from './redCal.json';

const Bulb = () => {
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
        return (
                            <span className="calendar"><Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            isClickToPauseDisabled={false}
                           
                            /></span>


            
        )
    
}

export default Bulb;