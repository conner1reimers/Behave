import React, { useEffect, useState } from 'react'
import Lottie from 'react-lottie';
import animationData from './income.json';

const IncomeIcon = () => {
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
            <div className="spin lotto income-ico">
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            height={40}
                            width={40}
                            isClickToPauseDisabled={true}


                            />
            </div>

            
        )
    
}

export default IncomeIcon;