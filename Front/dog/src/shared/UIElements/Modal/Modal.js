import React, { Fragment, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom';
import { motion, AnimatePresence, useAnimation, useMotionValue } from 'framer-motion';
import Backdrop from './Backdrop';
const modalImg = require('../../../styles/UI/ass.png')

const pageVariants = {
    initial: {
        x: "-1070%",
        scale: .6,
        opacity: 1,
        rotate: 140


    },
    out: {

        x: 0,
        scale: 0,
        opacity: 0,
        rotate: 99

    },
    in: {
        x: 0,
        scale: 1,
        opacity: 1,
        rotate: 0


    }
}

// const pageTransition = {
//     type: 'spring',
//     mass: .5,
//     damping: 1000
    
// }
const pageTransition = {
    type: 'spring',
    mass: 2.5,
    damping: 50,
    stiffness: 600
    
}

const transition = { duration: .3, loop: false, ease: 'easeIn' };

const Modal = (props) => {

    const scale = useMotionValue(1)
    const animation = useAnimation()
    const containerRef = useRef(null)

    const toggleAnimation = () => {
        animation.start({
            scale: [1, 1.3, 1],
            x: [0, 22, 0],
            rotate: [0, 2, 0],
            transition
        })
    }
    useEffect(() => {
        toggleAnimation()
    }, [props.noMatch]) 

    let art;

    if (props.img === 'auth') {
        art = 'auth-art'
    } else if (props.img === 'bulb') {
        art = 'bulb-art'
    } else if (props.img === 'moni') {
        art = 'money-art'
    }
    

    const mainModal = props.noMatch 
    ? (<motion.div 
        className="stuff"
        animate={animation}
       >
    <header className={`modal-header ${props.headerClass}`}>
        <h2 style={{color: 'rgba(199, 33, 33, 0.714)'}}>{props.header}</h2>
    </header>

    <form className="modal-form" onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()}>
        <div className={`modal-content ${props.contentClass}`} >
            {props.children}
        </div>
        {props.footer}
    </form>
    
    </motion.div>)

    : (<div className="stuff">
    <header className={`modal-header ${props.headerClass}`}>
        <h2>{props.header}</h2>
    </header>

    <form className="modal-form" onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()}>
        <div className={`modal-content ${props.contentClass}`} >
            {props.children}
        </div>
        {props.footer}
    </form>
    
    </div>)

    const modalContent = (
        <motion.div 
        initial="initial"
        animate="in"
        style={{overflow: "hidden"}}
        exit="out"
        variants={pageVariants}
        transition={pageTransition} 
        className="modal">

            {props.art && <div style={{color: 'red', }} style={{backgroundImage: modalImg}} className={`art ${art}`}>
                
            </div>}

            {mainModal}

            
        </motion.div>
    )

    return ReactDOM.createPortal(
        <Fragment>
            <AnimatePresence exitBeforeEnter>

                {props.show && modalContent}
                
                
            </AnimatePresence>
            {props.show && <Backdrop onClick={props.cancel}/>}
        </Fragment>, document.getElementById('modal-hook')
    )
}

export default Modal