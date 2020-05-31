import React, { Fragment, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom';
import { motion, AnimatePresence, useAnimation, useMotionValue } from 'framer-motion';
import Backdrop2 from './Backdrop';

const pageVariants = {
    initial: {
        x: "-200%",
        scale: .7,
        opacity: 1


    },
    out: {

        x: "-200%",
        scale: 0,
        opacity: 0

    },
    in: {
        x: 0,
        scale: 1,
        opacity: 1


    }
}

const pageTransition = {
    type: 'spring',
    mass: 1.5,
    damping: 30,
    stiffness: 599
    
}

const Modal = (props) => {    
    const modalContent = (
        <motion.div 
        initial="initial"
        animate="in"
        // style={{overflow: "hidden"}}
        exit="out"
        variants={pageVariants}
        transition={pageTransition} 
        className="msg-modal"
        >

            {props.children}

            
        </motion.div>
    )

    return ReactDOM.createPortal(
        <Fragment>
            <AnimatePresence exitBeforeEnter>

                {props.show && modalContent}
                
                
            </AnimatePresence>
            {props.show && <Backdrop2 onClick={props.cancel}/>}
        </Fragment>, document.getElementById('msgmodal-hook')
    )
}

export default Modal