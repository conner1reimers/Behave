import React from 'react'
import Lottie from 'react-lottie';
import animationData from './4768-trophy.json';

const Trophy = () => {
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
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            className="trophy-lottie"
                            height={60}
                            width={60}
                            isClickToPauseDisabled={true}
                           
                            />


            
        )
    
}

export default Trophy;