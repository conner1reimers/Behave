import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import calendar2 from '../dashLeftImgs/calendar2.svg'
import clock from '../dashLeftImgs/clock.svg'
import menu from '../dashLeftImgs/menu.svg'
import MouseOverLabel from '../../../../util/MouseOverLabel'

const pageVariants = {
    initial: {
        scale: .2,
        opacity: 0,
        y: '40%',
        rotate: 15


    },
    out: {


        scale: .2,
        opacity: 0,
        y: '70%',
        rotate: 15


    },
    in: {

        scale: 0.9,
        opacity: 1,
        y: '0%',
        rotate: 0
    }
}

const pageTransition = {
    type: 'spring',
    mass: 2.1,
    damping: 80,
    stiffness: 1200
    
}
const FirstEvent = React.memo((props) => {
    return ( 
                    <AnimatePresence exitBeforeEnter>
                        {props.firstUserEvent && !props.hideUserEvent && (
                            <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                            className="first-event"
                            >   
                                <span className="first-event--box"></span>

                                <header className="first-event--head">
                                    <img src={calendar2} alt=""/>
                                    <h1>Coming Up On Your Calendar:</h1>
                                    <MouseOverLabel
                                    label="Hide Upcoming Event"
                                    visibleClass="vis"
                                    hiddenClass="hid"
                                    labelClass="first-event--mouseover"
                                    // class="mouseover-main--outterDiv"
                                    >
                                        <button onClick={props.hideEventHandler} className="btn first-event--btn">
                                            <img src={menu} alt=""/>
                                        </button>
                                    </MouseOverLabel>
                                </header>
                                
                                <div className="first-event--content">
                                    <img src={clock} alt=""/>
                                    <p>{props.firstUserEvent.title}</p>
                                </div>
                                
                            </motion.div>
                        )}
                    </AnimatePresence>        
    )
})

export default FirstEvent
