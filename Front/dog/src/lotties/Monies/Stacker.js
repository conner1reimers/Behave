import React from 'react'
import Lottie from 'react-lottie';
import animationData from './moneyStack.json';
const Stacker = React.memo(() => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
        };
    let _lottieHeartRef;
    const onRefLottie = (ref) => {
        _lottieHeartRef = ref;
    } 

    return (
        <div className="stacker">
            <Lottie
                                ref={onRefLottie}
                                options={defaultOptions}
                                height={100}
                                isClickToPauseDisabled={true}

                                width={100}
                                />
        </div>        
    )
})

export default Stacker
