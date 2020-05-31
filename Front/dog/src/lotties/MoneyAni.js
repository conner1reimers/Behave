import React, { Fragment } from 'react'
import Lottie from 'react-lottie';
import animationData from './fetti.json';
import ReactDOM from 'react-dom';
import Media from 'react-media';


const MoneyAni = () => {
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

    // const complica = async () => {
    //     setTimeout(() => {
            
    //         setIsVis(false)
    //         lottie.setDirection(-1)

    //     }, 50);
    // }

    //     const mouseOverHandler = (event) => {
    //         setIsVis(true)
    //         _lottieHeartRef && _lottieHeartRef.setDirection(1)
    //         _lottieHeartRef && _lottieHeartRef.play()  
    //         console.log(_lottieHeartRef)
    //     }
    //     const mouseLeaveHandler = (event) => {
    //         _lottieHeartRef.setDirection(-1)
    //         _lottieHeartRef.play()
            
            
    //         complica()
            
    //     }


        return ReactDOM.createPortal(

            <Fragment>

                <Media query="(min-width: 599px)">
                    <div className="fetti" >
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            height={800}
                            isClickToPauseDisabled={true}

                            width={800}
                            />
                    </div>
                </Media>

                <Media query="(min-width: 925px)">
                    <div className="fetti" >
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            height={1000}
                            isClickToPauseDisabled={true}

                            width={1000}
                            />
                    </div>
                </Media>

                <Media query="(min-width: 1025px)">
                    <div className="fetti" >
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            height={1200}
                            isClickToPauseDisabled={true}

                            width={1200}
                            />
                    </div>
                </Media>

                <Media query="(min-width: 1300px)">
                    <div className="fetti" >
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            height={1500}
                            isClickToPauseDisabled={true}

                            width={1500}
                            />
                    </div>
                </Media>

                <Media query="(min-width: 1500px)">
                    <div className="fetti" >
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            height={1700}
                            isClickToPauseDisabled={true}

                            width={1700}
                            />
                    </div>
                </Media>

                <Media query="(min-width: 1700px)">
                    <div className="fetti" >
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            height={2000}
                            isClickToPauseDisabled={true}
                            width={2000}
                            />
                    </div>
                </Media>

                <Media query="(min-width: 2000px)">
                    <div className="fetti" >
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            height={2200}
                            isClickToPauseDisabled={true}
                            width={2200}
                            />
                    </div>
                </Media>

                <Media query="(min-width: 2200px)">
                    <div className="fetti" >
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            height={2500}
                            isClickToPauseDisabled={true}
                            width={2500}
                            />
                    </div>
                </Media>

                <Media query="(min-width: 2500px)">
                    <div className="fetti" >
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            height={2700}
                            isClickToPauseDisabled={true}
                            width={2700}
                            />
                    </div>
                </Media>

                <Media query="(min-width: 2700px)">
                    <div className="fetti" >
                            <Lottie
                            ref={onRefLottie}
                            options={defaultOptions}
                            height={3000}
                            isClickToPauseDisabled={true}
                            width={3000}
                            />
                    </div>
                </Media>


            </Fragment>

    
, document.getElementById('fetti-hook')

            
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

export default MoneyAni;