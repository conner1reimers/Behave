import React, { useEffect, useState } from 'react'
import Lottie from 'react-lottie';
import animationData from './redCalendar.json';
import lottie from 'lottie-web';

// const container = useRef(null)

// useEffect(() => {
//   lottie.loadAnimation({
//     container: container.current,
//     renderer: 'svg',
//     loop: true,
//     autoplay: true,
//     animationData: require('./office.json')
//   })
// }, [])

// return (
//   <div className="App">
//     <h1>React Lottie Demo</h1>
//     <div className="container" ref={container}></div>
//   </div>
// );
// } 

//    ^^^ THIS IS ANOTHER WAY TO USE LOTTIE IN REACT WITH ALL THE METHODS
const Calendar = () => {
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
            <div className="calendar" onMouseOver={() => setIsVis(true)} onMouseLeave={mouseLeaveHandler} onMouseEnter={mouseOverHandler}>
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            isClickToPauseDisabled={true}

                            
                            />
                            <span className={`calendar-label ${isVis ? 'vis' : 'hid'}`}>Calendar</span>

            </div>

            
        )
    
}

// ONE WAY TO FREEZE LAST FRAME IN ANIMATION 

// var container = document.getElementById("logo"),
//         anim = lottie.loadAnimation({
//         container: container,
//         renderer: "svg",
//         loop: false,
//         autoplay: true,
//         path: "static/logo.08.json"
// });

// anim.addEventListener("enterFrame", function (animation) {
//      if (animation.currentTime > (anim.totalFrames - 1)) {
//         anim.pause();
//      }
// });

export default Calendar;