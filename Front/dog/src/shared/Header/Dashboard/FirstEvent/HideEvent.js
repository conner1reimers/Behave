import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import menu from '.././dashLeftImgs/menu.svg'
import MouseOverLabel from '../../../../util/MouseOverLabel'
const showVariants = {
    initial: {
        scale: .2,
        opacity: 0,
        x: '400%',
        rotate: 15


    },
    out: {


        scale: .2,
        opacity: 0,
        x: '500%',
        rotate: 15


    },
    in: {

        scale: 1,
        opacity: 1,
        x: '0%',
        rotate: 0
    }
}
const showTransition = {
    type: 'spring',
    mass: 3.1,
    damping: 40,
    stiffness: 100
    
}
const HideEvent = React.memo((props) => {

    
    return (
        <AnimatePresence exitBeforeEnter>
        
        <motion.button
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={showVariants}
                            transition={showTransition}
                            className="showevent-button first-event--hide"
                            onClick={props.hideEventHandler}
                        >
                            <MouseOverLabel
                            label="Show Upcoming Event"
                            visibleClass="vis"
                            hiddenClass="hid"
                            labelClass="showevent-button--mouseover"
                                >
                                <img src={menu} alt=""/>
                            </MouseOverLabel>
                            
                        </motion.button>
        </AnimatePresence>
    )
})

export default HideEvent
