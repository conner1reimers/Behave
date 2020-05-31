import React, { Fragment } from 'react';
import Modal from '../UIElements/Modal/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';
import Backdrop2 from '../UIElements/Modal/Backdrop2';

const pageVariants = {
    initial: {
        y: "240%",
        rotate: 1,
        opacity: 0


    },
    out: {

        y: "300%",
        rotate: 120,
        opacity: 0.3

    },
    in: {
        y: 0,
        rotate: 0,
        opacity: 1

    }
}

const pageTransition = {
    type: 'spring',
    mass: 3.5,
    damping: 40,
    stiffness: 250
    
}

const ErrorModal = (props) => {

    const errModal = (
        <Fragment>
            <motion.div
                className="errorBefore"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
            </motion.div>

            <motion.div 
                className="error-modal"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition} 
            >
                <h1 className="err-head">Oops....  there was an <span className="err-head--error">ERROR</span></h1>
                <div className="err--box">
                    <p className="err">{props.error}</p>
                </div>
                
                <button className="btn btn-submit btn-err" onClick={props.clearError}>Ok</button>
            </motion.div>
        </Fragment>
    )

    return ReactDOM.createPortal(
        <Fragment>
            
            <AnimatePresence exitBeforeEnter>
                {!!props.error && errModal}
            </AnimatePresence>
            {!!props.error && <Backdrop2 onClick={props.clearError}/>}
        </Fragment>, document.getElementById('modal-error')

    )
}

export default ErrorModal
