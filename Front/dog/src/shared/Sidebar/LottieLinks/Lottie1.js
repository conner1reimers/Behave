import React, { useState } from 'react'
import Lottie from 'react-lottie';
import animationData from './greenCoin2.json';
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
const Lottie1 = () => {
    let _lottieHeartRef;
    const [isVis, setIsVis] = useState(false)

    
    const onRefLottie = (ref) => {
        _lottieHeartRef = ref;
    } 
    
    const eventListeners=[
        {
          eventName: 'complete',
          callback: () => console.log('the animation completed:'),
        },
      ]

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

        

        


        return (
            <div className="spin lotto" onMouseOver={() => setIsVis(true)} onMouseLeave={mouseLeaveHandler} onMouseEnter={mouseOverHandler}>
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            height={40}
                            width={40}
                            isClickToPauseDisabled={true}
                            />
                            <span className={`lotto-label ${isVis ? 'vis' : 'hid'}`}>History</span>

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

export default Lottie1;