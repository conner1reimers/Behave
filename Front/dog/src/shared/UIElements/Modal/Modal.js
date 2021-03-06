import React, { Fragment, useRef, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom';
import { motion, AnimatePresence, useAnimation, useMotionValue } from 'framer-motion';
import Backdrop from './Backdrop';
const modalImg = require('../../../styles/UI/ass.png')

const pageVariants = {
    initial: {
        translateX: "-50%",
        scale: 1,
        opacity: 1,


    },
    out: {

        translateX: 0,
        scale: 0,
        opacity: 0,

    },
    in: {
        translateX: 0,
        scale: 1,
        opacity: 1,


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
    damping: 40,
    stiffness: 600
    
}

const transition = { duration: .3, loop: false, ease: 'easeIn' };

const Modal = React.memo((props) => {

    const scale = useMotionValue(1)
    const animation = useAnimation()
    const containerRef = useRef(null)

    const toggleAnimation = useCallback(() => {
        animation.start({
            scale: [1, 1.3, 1],
            x: [0, 22, 0],
            rotate: [0, 2, 0],
            transition
        })
    }, []);
    
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
    let mainModal

    mainModal = props.noMatch 
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
    
    </div>);

    if (props.calendar) {
        mainModal = (
        <div className="stuff">
                
            <div className={`${props.contentClass}`} >
                    {props.children}
            </div>            
        </div>);
    }

    const classModal = props.calendar ? null : 'modal'

    const renders = useRef(0);
    

    const modalContent = (
        <motion.div 
        initial="initial"
        animate="in"
        style={{overflow: "hidden"}}
        exit="out"
        variants={pageVariants}
        transition={pageTransition} 
        className={`${classModal} ${props.modalClass}`}>

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
}, (prevProps, nextProps) => {
    if (prevProps.show !== nextProps.show) {
        return false;
    }
    if (prevProps.children !== nextProps.children) {
        return false;
    }
    return true;
})

export default Modal