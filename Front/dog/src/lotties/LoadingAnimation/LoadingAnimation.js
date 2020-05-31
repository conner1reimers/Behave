import React, { useEffect, useState, Fragment } from 'react'
import Lottie from 'react-lottie';
import animationData from './load.json';
import lottie from 'lottie-web';
import ReactDOM from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Backdrop from '../../shared/UIElements/Modal/Backdrop';

// const container = useRef(null)



// return (
//   <div className="App">
//     <h1>React Lottie Demo</h1>
//     <div className="container" ref={container}></div>
//   </div>
// );
// } 

//    ^^^ THIS IS ANOTHER WAY TO USE LOTTIE IN REACT WITH ALL THE METHODS


const pageVariants = {
    initial: {
        y: "-100%",
        scale: 0.5,
        rotate: 3,
        opacity: 1


    },
    out: {

        y: 0,
        scale: 0,
        rotate: 3,

        opacity: 0

    },
    in: {
        y: 0,
        scale: 1,
        rotate: 360,
        opacity: 1


    }
}

const pageTransition = {
    type: 'spring',
    mass: 1.5,
    damping: 100,
    stiffness: 200
    
}

const LoadingAnimation = (props) => {
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

    


        return ReactDOM.createPortal(
            <Fragment>
                
                <AnimatePresence>

                    {props.loading &&(
                    <motion.div
                        initial="initial"
                        animate="in"
                        style={{overflow: "hidden"}}
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition} 
                        className="loading"
                    > 
                         <Lottie
                                    className="loading-anim"
                                    ref={onRefLottie}
                                    options={defaultOptions}
                                    height={450}
                                    width={450}
                                    isClickToPauseDisabled={true}
                                    speed={0.34}
                                />
                    </motion.div>)}
                                
                </AnimatePresence>
                {props.loading && <Backdrop onClick={props.cancel}/>}

            </Fragment>, document.getElementById('loading-hook')


            
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

export default LoadingAnimation;