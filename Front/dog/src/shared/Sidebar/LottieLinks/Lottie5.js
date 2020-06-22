import React, {useState, useContext, useEffect } from 'react'
import Lottie from 'react-lottie';
import animationData from './lock.json';
import lottie from 'lottie-web';
import { AuthContext } from '../../../util/context/auth-context';
const Lottie5 = (props) => {
    let _lottieHeartRef;
    const [isVis, setIsVis] = useState(false)

    const auth = useContext(AuthContext)
    const onRefLottie = (ref) => {
        _lottieHeartRef = ref;
    } 

    const defaultOptions = {
        loop: false,
        autoplay: false,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
            progressiveLoad: true
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
        

        const loginLabel = auth.isLoggedIn 
        ? (<span className={`lotto-label ${isVis ? 'vis' : 'hid'}`}>Logout</span>)
        : (<span className={`lotto-label ${isVis ? 'vis' : 'hid'}`}>Login</span>)

        return (
            <div  className="spin lotto dog" onMouseOver={() => setIsVis(true)} onMouseLeave={mouseLeaveHandler} onMouseEnter={mouseOverHandler}>
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            isClickToPauseDisabled={true}
                            height={60}
                            width={60}
                            />
                            {loginLabel}
                            

            </div>

            
        )
    
}


export default Lottie5;