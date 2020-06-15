import React, { Fragment, useState, useEffect, useCallback, useContext } from 'react'
import getMonthYear, { getMonthYearNumbered, getMonthYearFromNumbered } from '../../util/getMonthYear'
import { AnimatePresence, motion } from 'framer-motion';
import close from './close.svg'
import Input from '../../shared/UIElements/Input/Input';
import { useForm } from '../../util/hooks/useForm';
import { VALIDATOR_REQUIRE } from '../../util/validators';
import { useHttpClient } from '../../util/hooks/http-hook';
import { AuthContext } from '../../util/context/auth-context';
import LoadingAnimation from '../../lotties/LoadingAnimation/LoadingAnimation';
import dot from './dot.svg'

const dayVariants = {
    initial: {
        scale: .9,
        x: '200%',


    },
    out: {


        scale: 0.8,
        x: '200%'


    },
    in: {

        scale: 1,
        x: '0%'
    }
}

const dayTransition = {
    type: 'spring',
    mass: 1.5,
    damping: 50,
    stiffness: 700,
    velocity: 3
    
}

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
const CalendarModal = (props) => {
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    let daysMapped;
    let chosenMonthText;
    
    const [monthChosen, setMonthChosen] = useState(null);
    const [yearChosen, setYearChosen] = useState(null);
    const [monthEvents, setMonthEvents] = useState(null)

    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const auth = useContext(AuthContext);

    useEffect(() => {
        setMonthChosen(currentMonth);
        setYearChosen(currentYear);
    }, []);


    const [isDayEdit, setIsDayEdit] = useState({
        clicked: false,
        day: {}
    });

    const editDayHandler = (day) => {

        if (day.day !== '') {
            if (isDayEdit.clicked && isDayEdit.day.day === day.day && isDayEdit.day.month === day.month && isDayEdit.day.year === day.year) {
                setIsDayEdit((prevState) => {
                    return {
                        ...prevState,
                        clicked: false
                    }
                })
            } else {
                setIsDayEdit({
                    clicked: true,
                    day: day
                })
            }
        }
        
        

    }

    const submitDayEditHandler = async (event) => {
        event.preventDefault()
        let response;
        try {
            response = await sendRequest(`http://localhost:5000/api/expense/`, 'PATCH',
            JSON.stringify({
                ammount: formState.inputs.ammount.value
            }),
            {'Content-Type': 'application/json'}
            );
            
            
                                   
        } catch (err) {}
    }

    const  cancelHandler = () => {
        setIsDayEdit({
            clicked: false,
            day: {}
        })
    }

    const [formState, inputHandler] = useForm({
        ammount: {
            value: '',
            isValid: false
        }
    }, false)

    const fetchEvents = async (curDate) => {
        let response;
        try {
            response = await sendRequest(`http://localhost:5000/api/event/${auth.userId}/${curDate}`);               
            setMonthEvents(response.events)                               
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        if(monthChosen && yearChosen) {
            let curDate = parseInt(`${monthChosen}${yearChosen}`)
            fetchEvents(curDate)
        }
    }, [monthChosen, yearChosen])

    const showCalendar = () => {
        // setMonthChosen(month)
        let firstDay = (new Date(yearChosen, monthChosen)).getDay();
        let daysInMonth = 32 - new Date(yearChosen, monthChosen, 32).getDate();

        const curDate = parseInt(`${monthChosen}${yearChosen}`)

        // if (events[curDate]) {
        //     event = events[curDate][1].title
        // }
       
        const curMonthObject = [];


        if (firstDay === 0) {
            for (let i = 0; i < daysInMonth; i++) {
                let curEvent = null;
                if (monthEvents) {
                    if (monthEvents[curDate]) {
                        if (monthEvents[curDate][i + 1]) {
                            curEvent = monthEvents[curDate][i - firstDay + 1].map((el) => {
                                return {
                                    title: el.title
                                }
                            })
                        }
                    }
                }
                
                
                curMonthObject[i] = {
                    day: i + 1,
                    events: curEvent,
                    month: monthChosen,
                    year: yearChosen
                }
            }
        } else {
            for (let i = 0; i < daysInMonth + firstDay; i++) {
               
                if (i < firstDay) {
                    curMonthObject[i] = {
                        day: '',
                        events: null,
                        month: monthChosen,
                        year: yearChosen
                    }
                } else {
                    let curEvent = null;
                    if (monthEvents) {
                        if (monthEvents[curDate]) {
                            if (monthEvents[curDate][i - firstDay + 1]) {
                                curEvent = monthEvents[curDate][i - firstDay + 1].map((el) => {
                                    return {
                                        title: el.title
                                    }
                                })
                            }
                        }
                    }
                    
                    curMonthObject[i] = {
                        day: (i + 1) - firstDay,
                        events: curEvent,
                        month: monthChosen,
                        year: yearChosen
                    }
                }
            }
        }
        
            
        

        daysMapped = curMonthObject.map((day, index) => {
            let dayEditElement;
                if (isDayEdit) {
                    if (isDayEdit.clicked === true && isDayEdit.day.day === day.day && isDayEdit.day.month === day.month && isDayEdit.day.year === day.year) {
                        let dateChosen = getMonthYearFromNumbered(day.month, day.day)
                        dayEditElement = (
                            <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={dayEditVariants}
                            transition={dayEditTransition}
                            className="calendar-modal--dayedit"
                            >
                                <header className="calendar-modal--dayedit--head">
                                    <h1>{dateChosen}</h1>
                                    <button className="btn cal-cancel" onClick={cancelHandler}><img src={close} alt=""/></button>
                                </header>

                                <form onSubmit={submitDayEditHandler} className="calendar-modal--dayedit--form">
                                <Input
                                            name="Caption"
                                            id="subject"
                                            onInput={inputHandler}
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
                                    id="subject"
                                    onInput={inputHandler}
                                    validator={VALIDATOR_REQUIRE()}
                                    errorText="Need atleast 1 character"
                                    type="text"
                                    class="calendar-modal--dayedit--input"
                                    errorClass="error-notNum"
                                    />
                                    

                                    <button type="submit" className="btn btn-submit calendar-modal--dayedit--btn">Submit</button>

                                </form>

                            </motion.div>
                        )
                    }
                }

            let eventz = [];
            let i = 0;
            if (day.events) {
                for (const events of day.events) {
                    eventz.push(events);
                    i += 1;
                    if (i >= 3) {
                        break
                    }
                }
                
            }

            
            return (
                <Fragment
                key={index}

                >
                <AnimatePresence 
                    key={index}
                    exitBeforeEnter
                >
                    <motion.li
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={dayVariants}
                            transition={dayTransition}
                            key={index}
                            className="calendar-modal--dayitem"
                            onClick={() => editDayHandler(day)}
                        
                        >                        
                            <span className="calendar-modal--text">{day.day}</span>
                            <ul className="calendar-modal--event-list">
                                {day.events && day.events.length <=2 && day.events.map((el, index) => {
                                        return (
                                            <li
                                            key={index}
                                            className="calendar-modal--event-item">
                                                <img src={dot}></img>
                                                <span>{el.title}</span>
                                            </li>
                                        )
                                    })}

                                {day.events && day.events.length >= 3 && eventz.map((el, index) => {
                                    if (index <= 1) {
                                        return (
                                            <li
                                            key={index}
                                            className="calendar-modal--event-item">
                                                <img src={dot}></img>
                                                <span>{el.title}</span>
                                            </li>
                                        )
                                    } else {
                                        return (
                                            <li
                                            key={index}
                                            className="calendar-modal--event-item">
                                                <button className="btn calendar-modal--event-item--btn">....View more</button>
                                            </li>
                                        )   
                                    }
                                    
                                })}  
                            </ul>
                        </motion.li>
                        </AnimatePresence>

                        {isDayEdit.clicked && (
                                <AnimatePresence exitBeforeEnter>
                                    {dayEditElement}
                                </AnimatePresence>
                        )}
            </Fragment>)})

        chosenMonthText = getMonthYearFromNumbered(monthChosen, yearChosen);
    }

    showCalendar(currentMonth, currentYear)



    const nextMonth = () => {

        setYearChosen((prevState) => {
            if (monthChosen === 11) {
                return prevState + 1
            } else {
                return prevState
            }
        });

        setMonthChosen((prevState) => {
            return (prevState + 1) % 12
        });

    }

    const prevMonth = () => {

        setYearChosen((prevState) => {
            if (monthChosen === 0) {
                return prevState - 1
            } else {
                return prevState
            }
        });

        setMonthChosen((prevState) => {
            if (monthChosen === 0) {
                return 11
            } else {
                return prevState - 1
            }
        });

    }


    return (
        <Fragment>
            {isLoading && <LoadingAnimation/>}

            <header className="cal-header">
                <h2 className="calendar-modal--head">Month of: {chosenMonthText} </h2>
                <button className="btn btn-submit calendar-modal--btn" onClick={prevMonth}>PREV</button>
                <button className="btn btn-submit calendar-modal--btn" onClick={nextMonth}>NEXT</button>

            </header>

            <ul className="calendar-modal--days">
                <span className="calendar-modal--days--oftheweek">Sun.</span>
                <span className="calendar-modal--days--oftheweek">Mon.</span>
                <span className="calendar-modal--days--oftheweek">Tue.</span>
                <span className="calendar-modal--days--oftheweek">Wed.</span>
                <span className="calendar-modal--days--oftheweek">Thur.</span>
                <span className="calendar-modal--days--oftheweek">Fri.</span>
                <span className="calendar-modal--days--oftheweek">Sat.</span>
                {daysMapped}
            </ul>
        </Fragment>
    )
}

export default CalendarModal
