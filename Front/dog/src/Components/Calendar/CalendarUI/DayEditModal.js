import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import close from '../close.svg'
import Input from '../../../shared/UIElements/Input/Input'
import { VALIDATOR_REQUIRE } from '../../../util/validators'

const dayEditVariants = {
    initial: {
        scale: .9,
        y: '200%',



    },
    out: {


        scale: 0.8,
        y: '200%',



    },
    in: {

        scale: 1,
        y: '0%',

    }
}

const dayEditTransition = {
    type: 'spring',
    mass: 2.3,
    damping: 63,
    stiffness: 500,
    velocity: 3
    
}

const DayEditModal = (props) => {
    return (
                        <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={dayEditVariants}
                            transition={dayEditTransition}
                            className="calendar-modal--dayedit"
                            >
                                <header className="calendar-modal--dayedit--head">
                                    <h1>{props.dateChosen}</h1>
                                    <button className="btn cal-cancel" onClick={props.cancelHandler}><img src={close} alt=""/></button>
                                </header>

                                <form onSubmit={props.submitDayEditHandler} className="calendar-modal--dayedit--form">
                                <Input
                                            name="category"
                                            id="category"
                                            onInput={props.inputHandler}
                                            validator={VALIDATOR_REQUIRE()}
                                            errorText="Need atleast 1 character"
                                            type="input-options"
                                            class="calendar-modal--dayedit--input"
                                            errorClass="error-notNum"
                                            cat="cal-options"
                                            dropdownClass="calendar-modal--dayedit--input--dropdown"
                                            labelClass="calendar-modal--dayedit--input--dropdown--label"
                                            />
                                    {/* <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <Input
                                            name="Caption"
                                            id="subject"
                                            onInput={inputHandler}
                                            validator={VALIDATOR_REQUIRE()}
                                            errorText="Need atleast 1 character"
                                            type="text"
                                            class="calendar-modal--dayedit--input"
                                            errorClass="error-notNum"
                                            />
                                            
                                    </div> */}

                                    <Input
                                    name="Caption"
                                    id="title"
                                    onInput={props.inputHandler}
                                    validator={VALIDATOR_REQUIRE()}
                                    errorText="Need atleast 1 character"
                                    type="text"
                                    class="calendar-modal--dayedit--input"
                                    errorClass="error-notNum"
                                    />

                                {/* {moreOptionsEdit && (
                                    <AnimatePresence>
                                        {moreOptionsEdit && moreOptions}
                                    </AnimatePresence>
                                )}                                     */}

                                    <button type="submit" className="btn btn-submit calendar-modal--dayedit--btn">Submit</button>

                                </form>
                                <button onClick={props.moreOptionsHandler} className="btn calendar-modal--dayedit--more">More Options</button>

                                

                        </motion.div>
    )
}

export default React.memo(DayEditModal)
