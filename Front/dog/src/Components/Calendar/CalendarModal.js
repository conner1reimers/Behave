import React, { Fragment, useState, useEffect, useCallback, useContext, useMemo, useRef } from 'react'
import getMonthYear, { getMonthYearNumbered, getMonthYearFromNumbered } from '../../util/getMonthYear'
import { AnimatePresence, motion } from 'framer-motion';
import close from './close.svg'
import Input from '../../shared/UIElements/Input/Input';
import { useForm } from '../../util/hooks/useForm';
import { VALIDATOR_REQUIRE, VALIDATOR_NONE } from '../../util/validators';
import { useHttpClient } from '../../util/hooks/http-hook';
import { AuthContext } from '../../util/context/auth-context';
import LoadingAnimation from '../../lotties/LoadingAnimation/LoadingAnimation';
import dot from './dot.svg'
import ErrorModal from '../../shared/ErrorModal/ErrorModal';
import MouseOverLabel from '../../util/MouseOverLabel';
import pencil from '../../shared/Header/Dashboard/dashLeftImgs/pencil.svg';
import work from './calendarPics/work.svg';
import friend from './calendarPics/friend.svg';
import family from './calendarPics/family.svg';
import other from './calendarPics/other.svg';
import travel from './calendarPics/travel.svg';
import bday from './calendarPics/bday.svg';
import moon from './calendarPics/moon.svg';
import trash from './calendarPics/trash.svg';
import {uuid} from 'uuidv4';
import DayEditModal from './CalendarUI/DayEditModal';

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

const moreOptionsVariants = {
    initial: {
        scale: .7,
        x: '-40%',
        opacity: 0.7



    },
    out: {


        scale: 0.8,
        x: '-200%',
        opacity: 0



    },
    in: {

        scale: 1,
        x: '50%',
        opacity: 1

    }
}

const moreOptionsTransition = {
    type: 'spring',
    mass: 2.3,
    damping: 93,
    stiffness: 200,
    velocity: 1
    
}

const eventEditVariants = {
    initial: {
        scale: .9,
        x: '-200%',
        opacity: 0.7


    },
    out: {


        scale: 0.8,
        x: '-200%',
        opacity: 0.7


    },
    in: {

        scale: 1,
        x: '0%',
        opacity: 1
    }
}
const eventEditVariants2 = {
    initial: {
        scale: .9,
        x: '-200%',
        opacity: 0.7


    },
    out: {


        scale: 0.8,
        x: '-200%',
        opacity: 0.7


    },
    in: {

        scale: 1,
        x: '0%',
        opacity: 1
    }
}

const eventEditTransition = {
    type: 'spring',
    mass: .5,
    damping: 50,
    stiffness: 250,
    velocity: 2
    
}
const CalendarModal = (props) => {
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    let daysMapped;
    let chosenMonthText;
    
    const [monthChosen, setMonthChosen] = useState(null);
    const [yearChosen, setYearChosen] = useState(null);
    const [monthEvents, setMonthEvents] = useState({})

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

    const [moreOptionsEdit, setMoreOptionsEdit] = useState(false);

    const [eventEdit, setEventEdit] = useState({
        clicked: false,
        event: {}
    });

    const mountedRef = useRef(true);
    useEffect(() => {

        return(() => {
            mountedRef.current = false;
        })
    }, [])

    

    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        category: {
            value: 'personal',
            isValid: true
        },
        description: {
            value: 'personal',
            isValid: true
        },
        time: {
            value: 'personal',
            isValid: true
        },
        location: {
            value: 'personal',
            isValid: true
        }
    }, false)

    const editDayHandler = (day) => {

        setEventEdit({
            clicked: false,
            event: {}
        });
        setViewMoreEventsOptions({
            clicked: false,
            events: [{}]
        });
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

    const moreOptionsHandler = () => {
        setMoreOptionsEdit((prevState) => !prevState)
    }
    
    const submitDayEditHandler = async (event) => {
        event.preventDefault()
        let curDate = parseInt(`${monthChosen}${yearChosen}`)
        let day = parseInt(isDayEdit.day.day)
        let response;

        try {
            response = await sendRequest(`http://localhost:5000/api/event/`, 'POST',
            JSON.stringify({

                title: formState.inputs.title.value,
                creator: auth.userId,
                category: formState.inputs.category.value,
                time: formState.inputs.time.value,
                monthYear: curDate,
                day: day,
                location: formState.inputs.location.value,
                description: formState.inputs.description.value,

            }),
            {'Content-Type': 'application/json'}
            );
            if (!mountedRef.current) return null;

            setMonthEvents((prevState) => {
                if (prevState[curDate]) {
                    if (prevState[curDate][day] && isDayEdit.day.events) {
                        prevState[curDate][day].push({
                            title: formState.inputs.title.value,
                            category: formState.inputs.category.value,
                            time: formState.inputs.time.value,
                            monthYear: curDate,
                            day: day,
                            location: formState.inputs.location.value,
                            description: formState.inputs.description.value,
                            id: response.event._id
                        })
                        return {
                            ...prevState,
                            
                        }
                    } else {
                            prevState[curDate][isDayEdit.day.day] = [{
                                title: formState.inputs.title.value,
                                category: formState.inputs.category.value,
                                time: formState.inputs.time.value,
                                monthYear: curDate,
                                day: day,
                                location: formState.inputs.location.value,
                                description: formState.inputs.description.value,
                                id: response.event._id
                            }]
                            return {
                                ...prevState,
                                
                            }
                    }
                } else {
                        prevState[curDate][isDayEdit.day.day] = [{
                            title: formState.inputs.title.value,
                            category: formState.inputs.category.value,
                            time: formState.inputs.time.value,
                            monthYear: curDate,
                            day: day,
                            location: formState.inputs.location.value,
                            description: formState.inputs.description.value,
                            id: response.event._id
                    }]
                    return {
                        ...prevState,
                        
                    }
                    
                }
            })
            setIsDayEdit({
                clicked: false,
                day: {}
            });
            
            
                                   
        } catch (err) {

        }
    }

    const  cancelHandler = () => {
        setIsDayEdit({
            clicked: false,
            day: {}
        });
        setEventEdit({
            clicked: false,
            event: {}
        });
        setViewMoreEventsOptions({
            clicked: false,
            events: [{}]
        });
    };

    const deleteEventHandler = async () => {

        let response;
        let deleteId = eventEdit.event.id;
        try {
            response = await sendRequest(`http://localhost:5000/api/event/${deleteId}`, 'DELETE')
            console.log(response);
            if (!mountedRef.current) return null;

            setMonthEvents((prevState) => {
                let curDate = parseInt(`${monthChosen}${yearChosen}`);
                let day = parseInt(eventEdit.event.day);
                prevState[curDate][day] = prevState[curDate][day].filter((el) => {
                    return el.id !== deleteId
                })
                return {
                    ...prevState
                }            
            });

            setEventEdit({
                clicked: false,
                event: {}
            });
            setEditEventFurther(false);
        } catch (err) {}
    }

    const editSingleEvent = (event, item) => {
        event.preventDefault();
        event.cancelBubble = true
        event.stopPropagation()
        setIsDayEdit({
            clicked: false,
            event: {}
        })
        setEditEventFurther(false);

        setViewMoreEventsOptions({
            clicked: false,
            events: [{}]
        });
        

        if (eventEdit.clicked) {
            if (eventEdit.event.title === item.title && eventEdit.event.category === item.category) {
                setEventEdit((prevState) => {return {...prevState, clicked: false}})
            } else {
                let categoryEventImg;

                switch (item.category) {
                    case 'work': categoryEventImg = work; break;
                    case 'family': categoryEventImg = family;  break;
                    case 'other': categoryEventImg = other; break;
                    case 'travel': categoryEventImg = travel; break;
                    case 'friend': categoryEventImg = friend; break;
                    case 'birthday': categoryEventImg = bday; break;
                    default: categoryEventImg = moon; break;
                }                
                setEventEdit({
                    clicked: true,
                    event: {
                        title: item.title,
                        category: item.category,
                        time: item.time,
                        description: item.description,
                        location: item.location,
                        pic: categoryEventImg,
                        id: item.id,
                        day: item.day
                    }
    
                });
            }
        } else {
            let categoryEventImg;

            switch (item.category) {
                case 'work': categoryEventImg = work; break;
                case 'family': categoryEventImg = family;  break;
                case 'other': categoryEventImg = other; break;
                case 'travel': categoryEventImg = travel; break;
                case 'friend': categoryEventImg = friend; break;
                case 'birthday': categoryEventImg = bday; break;
                default: categoryEventImg = moon; break;
            }            
            setEventEdit({
                clicked: true,
                event: {
                    title: item.title,
                    category: item.category,
                    time: item.time,
                    description: item.description,
                    location: item.location,
                    pic: categoryEventImg,
                    id: item.id,
                    day: item.day
                }

            });
        }
    }

    const [editEventFurther, setEditEventFurther] = useState(false)
    const editEventFurtherHandler = () => {
        setEditEventFurther((prevState) => !prevState);
    }

    const fetchEvents = async (curDate) => {
        let response;
        try {
            response = await sendRequest(`http://localhost:5000/api/event/${auth.userId}/${curDate}`);    
            if (!mountedRef.current) return null;           
            setMonthEvents(response.events)                               
        } catch (err) {
            
        }
    }
    useEffect(() => {
        if(monthChosen && yearChosen) {
            let curDate = parseInt(`${monthChosen}${yearChosen}`)
            fetchEvents(curDate)
        }
    }, [monthChosen, yearChosen]);



    const [viewMoreEventsOptions, setViewMoreEventsOptions] = useState({
        clicked: false,
        events: [{}]
    })
    const viewMoreHandler = (event, dayEvents) => {
        event.preventDefault();
        event.cancelBubble = true
        event.stopPropagation()
        setIsDayEdit({
            clicked: false,
            event: {}
        })
        setEditEventFurther(false);

        console.log(dayEvents)

        if (viewMoreEventsOptions.clicked) {
            if (viewMoreEventsOptions.events[0].title === dayEvents[0].title) {
                setViewMoreEventsOptions(prevState => {return {...prevState, clicked: false}})
                
            } else {
                setViewMoreEventsOptions({
                    clicked: true,
                    events: dayEvents
                })
            }
        } else {
            setViewMoreEventsOptions({
                clicked: true,
                events: dayEvents
            })
        }
        

    }


    let curMonthObject = []

    const setCurMonthObject = () => {

    }
    const showCalendar = () => {
        // setMonthChosen(month)
        let firstDay = (new Date(yearChosen, monthChosen)).getDay();
        let daysInMonth = 32 - new Date(yearChosen, monthChosen, 32).getDate();

        const curDate = parseInt(`${monthChosen}${yearChosen}`)

        const curMonthObject = [];


        if (firstDay === 0) {
            for (let i = 0; i < daysInMonth; i++) {
                let curEvent = null;
                if (monthEvents) {
                    if (monthEvents[curDate]) {
                        if (monthEvents[curDate][i + 1]) {
                            curEvent = monthEvents[curDate][i - firstDay + 1].map((el) => {
                                let categoryEventImg;
                                switch (el.category) {
                                    case 'work': categoryEventImg = work; break;
                                    case 'family': categoryEventImg = family;  break;
                                    case 'other': categoryEventImg = other; break;
                                    case 'travel': categoryEventImg = travel; break;
                                    case 'friend': categoryEventImg = friend; break;
                                    case 'birthday': categoryEventImg = bday; break;
                                    default: categoryEventImg = moon; break;
                                }   
                                return {
                                    title: el.title,
                                    category: el.category,
                                    time: el.time,
                                    description: el.description,
                                    location: el.location,
                                    pic: categoryEventImg,
                                    id: el.id,
                                    day: el.day
                                }
                            })
                        }
                    }
                }
                
                
                curMonthObject[i] = {
                    day: i + 1,
                    events: curEvent,
                    month: monthChosen,
                    year: yearChosen,
                    dayId: uuid()
                }
            }
        } else {
            for (let i = 0; i < daysInMonth + firstDay; i++) {
               
                if (i < firstDay) {
                    curMonthObject[i] = {
                        day: '',
                        events: null,
                        month: monthChosen,
                        year: yearChosen,
                        dayId: uuid()
                    }
                } else {
                    let curEvent = null;
                    if (monthEvents) {
                        if (monthEvents[curDate]) {
                            if (monthEvents[curDate][i - firstDay + 1]) {
                                curEvent = monthEvents[curDate][i - firstDay + 1].map((el) => {
                                    let categoryEventImg;
                                    switch (el.category) {
                                        case 'work': categoryEventImg = work; break;
                                        case 'family': categoryEventImg = family;  break;
                                        case 'other': categoryEventImg = other; break;
                                        case 'travel': categoryEventImg = travel; break;
                                        case 'friend': categoryEventImg = friend; break;
                                        case 'birthday': categoryEventImg = bday; break;
                                        default: categoryEventImg = moon; break;
                                    }  
                                    return {
                                        title: el.title,
                                        category: el.category,
                                        time: el.time,
                                        description: el.description,
                                        location: el.location,
                                        pic: categoryEventImg,
                                        id: el.id,
                                        day: el.day
                                    }
                                })
                            }
                        }
                    }
                    
                    curMonthObject[i] = {
                        day: (i + 1) - firstDay,
                        events: curEvent,
                        month: monthChosen,
                        year: yearChosen,
                        dayId: uuid()
                    }
                }
            }
        }
        
        daysMapped = curMonthObject.map((day, index) => {
            let dayEditElement;
            let dateChosen
                if (isDayEdit) {
                    if (isDayEdit.clicked === true && isDayEdit.day.day === day.day && isDayEdit.day.month === day.month && isDayEdit.day.year === day.year) {
                        dateChosen = getMonthYearFromNumbered(day.month, day.day)

                        let moreOptions = (
                            <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={moreOptionsVariants}
                            transition={moreOptionsTransition}
                            className="calendar-modal--dayedit--more-options"
                            >
                                <header className="calendar-modal--dayedit--head">
                                    <h1 className="calendar-modal--dayedit--head">More Options...</h1>
                                    <button className="btn cal-cancel" onClick={cancelHandler}><img src={close} alt=""/></button>
                                </header>
                                <Input
                                    name="Description"
                                    id="description"
                                    onInput={inputHandler}
                                    validator={VALIDATOR_NONE()}
                                    errorText="Need atleast 1 character"
                                    type="text"
                                    class="calendar-modal--dayedit--input calinput-not"
                                    errorClass="error-notNum"
                                    />
                                <Input
                                    name="Location"
                                    id="location"
                                    onInput={inputHandler}
                                    validator={VALIDATOR_NONE()}
                                    errorText="Need atleast 1 character"
                                    type="text"
                                    class="calendar-modal--dayedit--input calinput-not"
                                    errorClass="error-notNum"
                                    />
                                <Input
                                    name="What time?"
                                    id="time"
                                    onInput={inputHandler}
                                    validator={VALIDATOR_NONE()}
                                    errorText="Need atleast 1 character"
                                    type="text"
                                    class="calendar-modal--dayedit--input calinput-not"
                                    errorClass="error-notNum"
                                    />
                            </motion.div>
                        )
                        

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
                                            name="category"
                                            id="category"
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
                                    id="title"
                                    onInput={inputHandler}
                                    validator={VALIDATOR_REQUIRE()}
                                    errorText="Need atleast 1 character"
                                    type="text"
                                    class="calendar-modal--dayedit--input"
                                    errorClass="error-notNum"
                                    />

                                {moreOptionsEdit && (
                                    <AnimatePresence>
                                        {moreOptionsEdit && moreOptions}
                                    </AnimatePresence>
                                )}                                    

                                    <button type="submit" className="btn btn-submit calendar-modal--dayedit--btn">Submit</button>

                                </form>
                                <button onClick={moreOptionsHandler} className="btn calendar-modal--dayedit--more">More Options</button>

                                

                            </motion.div>
                        )
                    }
                }

            let eventz = [];
            let i = 0;
            if (day.events) {
                for (const events of day.events) {
                    if (i >= 3) break;

                    eventz.push(events);
                    
                    
                    i += 1;
                }
                
            }

            
            return (
                <Fragment
                key={index}

                >
                {isDayEdit.clicked && (
                    <AnimatePresence exitBeforeEnter>
                        {dayEditElement}
                    </AnimatePresence>
                )}
                <AnimatePresence 
                    exitBeforeEnter
                >
                    <motion.li
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={dayVariants}
                            transition={dayTransition}
                            className="calendar-modal--dayitem"
                            onClick={() => editDayHandler(day)}
                        
                        >                        
                            <span className="calendar-modal--text">{day.day}</span>
                            <ul className="calendar-modal--event-list">
                                {day.events && day.events.length <=2 && day.events.map((el, index) => {
                                    let label = (
                                        <Fragment>
                                            <header className="mouseover-main--header">
                                                <img alt="" src={el.pic}/>
                                                <h1>{el.category}</h1>
                                            </header>
                                            <div>
                                                <div className="mouseover-main--info"> 
                                                    <span>Title: </span> 
                                                    <p> {el.title}</p>
                                                </div>
                                                
                                                {el.description && (
                                                <div className="mouseover-main--info"> 
                                                    <span>Descr: </span> 
                                                    <p> {el.description}</p>
                                                </div>
                                                )}

                                                {el.time && (
                                                <div className="mouseover-main--info"> 
                                                    <span>time: </span> 
                                                    <p> {el.time}</p>
                                                </div>
                                                )}
                                                {el.location && (
                                                <div className="mouseover-main--info"> 
                                                    <span>location: </span> 
                                                    <p> {el.location}</p>
                                                </div>
                                                )}
                                            </div>


                                        </Fragment>
                                    )
                                    let categoryImg;

                                    switch (el.category) {
                                        case 'work': categoryImg = work; break;
                                        case 'family': categoryImg = family;  break;
                                        case 'other': categoryImg = other; break;
                                        case 'travel': categoryImg = travel; break;
                                        case 'friend': categoryImg = friend; break;
                                        case 'bday': categoryImg = bday; break;
                                        default: categoryImg = moon; break;
                                    }

                                        return (
                                            <MouseOverLabel
                                                label={label}
                                                visibleClass="vis"
                                                hiddenClass="hid"
                                                key={index}
                                                labelClass="edit-label cal-mouseover mouseover-main"
                                                class="mouseover-main--outterDiv"
                                            >
                                                <li
                                                onClick={(event) => editSingleEvent(event, el)}
                                                key={index}
                                                className="calendar-modal--event-item">
                                                    <img src={categoryImg}></img>
                                                    <span>{el.title}</span>
                                                </li>
                                            </MouseOverLabel>
                                        )
                                    })}

                                {day.events && day.events.length >= 3 && eventz.map((el, index) => {
                                    if (index <= 1) {

                                        let label = (
                                        <Fragment>
                                            <header className="mouseover-main--header">
                                                <img alt="" src={el.pic}/>
                                                <h1>{el.category}</h1>
                                            </header>
                                            <div>
                                                <div className="mouseover-main--info"> 
                                                    <span>Title: </span> 
                                                    <p> {el.title}</p>
                                                </div>
                                                
                                                {el.description && (
                                                <div className="mouseover-main--info"> 
                                                    <span>Descr: </span> 
                                                    <p> {el.description}</p>
                                                </div>
                                                )}

                                                {el.time && (
                                                <div className="mouseover-main--info"> 
                                                    <span>time: </span> 
                                                    <p> {el.time}</p>
                                                </div>
                                                )}
                                                {el.location && (
                                                <div className="mouseover-main--info"> 
                                                    <span>location: </span> 
                                                    <p> {el.location}</p>
                                                </div>
                                                )}
                                            </div>


                                        </Fragment>
                                    )
                                        let categoryImg;
                                    switch (el.category) {
                                        case 'work': categoryImg = work; break;
                                        case 'family': categoryImg = family; break;
                                        case 'other': categoryImg = other; break;
                                        case 'travel': categoryImg = travel; break;
                                        case 'friend': categoryImg = friend; break;
                                        case 'bday': categoryImg = bday; break;
                                        default: categoryImg = moon; break;
                                    }
                                        return (
                                            <MouseOverLabel
                                                label={label}
                                                labelClass="edit-label cal-mouseover mouseover-main"
                                                class="mouseover-main--outterDiv"
                                                visibleClass="vis"
                                                hiddenClass="hid"
                                                key={index}
                                            >
                                            <li
                                            onClick={(event) => editSingleEvent(event, el)}
                                            key={index}
                                            className="calendar-modal--event-item">
                                                <img src={categoryImg}></img>
                                                <span>{el.title}</span>
                                            </li>
                                            </MouseOverLabel>
                                        )
                                    } else if (index >= 2) {
                                        let label = (
                                            <Fragment>
                                                <h1>View all events on this day</h1>
                                                
                                            </Fragment>
                                        )
                                        return (
                                            <MouseOverLabel
                                                label={label}
                                                labelClass="edit-label calendar-modal--viewmore-mouseover"
                                                visibleClass="vis"
                                                hiddenClass="hid"
                                                key={index}
                                            >
                                            <li
                                            key={index}
                                            className="btn calendar-modal--event-item--btn">
                                                <button onClick={(event) => viewMoreHandler(event, day.events)} className="btn calendar-modal--event-item--btn">....View more</button>
                                            </li>
                                            </MouseOverLabel>
                                        )   
                                    }
                                    
                                })}  
                            </ul>
                        </motion.li>
                        </AnimatePresence>

                        
            </Fragment>)})

        chosenMonthText = getMonthYearFromNumbered(monthChosen, yearChosen);
    };
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

    // let content;
    // if (isLoading) {
    //     content = (
    //     <Fragment>
    //         <LoadingAnimation loading={isLoading}/>
    //     </Fragment>)
    // } else {
    //     content = null;
    // }

    const submitEventEditHandler = async (event) => {
        event.preventDefault();
        let curDate = parseInt(`${monthChosen}${yearChosen}`);
        let day = parseInt(eventEdit.event.day);
        let response;

        const time = (formState.inputs.time.value === '') ? eventEdit.event.time : formState.inputs.time.value;
        const title = (formState.inputs.title.value === '') ? eventEdit.event.title : formState.inputs.title.value;
        const description = (formState.inputs.description.value === '') ? eventEdit.event.description : formState.inputs.description.value;
        const location = (formState.inputs.location.value === '') ? eventEdit.event.location : formState.inputs.location.value;

        try {
            response = await sendRequest(`http://localhost:5000/api/event/${eventEdit.event.id}`, 'PATCH',
            JSON.stringify({
                title: title,
                time: time,
                location: location,
                description: description,

            }),
            {'Content-Type': 'application/json'}
            );
            if (!mountedRef.current) return null;
            
            setMonthEvents((prevState) => {
                prevState[curDate][day] = prevState[curDate][day].filter((el) => 
                    {return el.id !== eventEdit.event.id});

                prevState[curDate][day].push({
                    category: eventEdit.event.category,
                    id: eventEdit.event.id,
                    title: title,
                    time: time,
                    location: location,
                    description: description,   
                    monthYear: curDate,
                    day: day,
                })
                return {
                    ...prevState,
                }
            })
            setEditEventFurther(false);

            setEventEdit({
                clicked: false,
                event: {}
            });

        }catch (err) {}

    }

    let editFurterElement = (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={eventEditVariants2}
            transition={eventEditTransition}     
            className='eventEditElement--further'  
        >
                <header className="calendar-modal--dayedit--head">
                    <button className="btn cal-cancel" onClick={() => setEditEventFurther(false)}><img src={close} alt=""/></button>
                </header>
            <form onSubmit={(event) => submitEventEditHandler(event)} className="calendar-modal--dayedit--form">

                <Input
                name="New Caption"
                id="title"
                onInput={inputHandler}
                validator={VALIDATOR_NONE()}
                errorText="Need atleast 1 character"
                type="text"
                class="calendar-modal--dayedit--input calinput-not"
                errorClass="error-notNum"                                    
                />
                <Input
                name="New Location"
                id="location"
                onInput={inputHandler}
                validator={VALIDATOR_NONE()}
                errorText="Need atleast 1 character"
                type="text"
                class="calendar-modal--dayedit--input calinput-not"
                errorClass="error-notNum"                                    
                />
                <Input
                name="New Description"
                id="description"
                onInput={inputHandler}
                validator={VALIDATOR_NONE()}
                errorText="Need atleast 1 character"
                type="text"
                class="calendar-modal--dayedit--input calinput-not"
                errorClass="error-notNum"                                    
                />
                <Input
                name="New Time"
                id="time"
                onInput={inputHandler}
                validator={VALIDATOR_NONE()}
                errorText="Need atleast 1 character"
                type="text"
                class="calendar-modal--dayedit--input calinput-not"
                errorClass="error-notNum"                                    
                />
                <button style={{marginTop: '8rem'}} type="submit" className="btn btn-submit calendar-modal--dayedit--btn">Submit</button>

            </form>
        </motion.div>
    )

    let categoryEventImg;


                                


    let eventEditElement = (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={eventEditVariants}
            transition={eventEditTransition}     
            className='eventEditElement'  
        >
            <header className="eventEditElement--head">
                <h1 style={{fontSize: '2.5rem', textTransform: 'capitalize'}} className="eventEditElement--cat-head">{eventEdit.event.category}</h1>
                <MouseOverLabel
                    label='Edit'
                    labelClass="edit-label cal-mouseover"
                    visibleClass="vis"
                    hiddenClass="hid"
                    class="calendar-modal--dayedit--head--mouseover eventedit-mouseover"
                >
                    <button onClick={editEventFurtherHandler} className="btn cal-cancel cal-pencil"><img src={pencil} alt=""/></button>
                </MouseOverLabel>
                <img className="cal-eventedit-img cal-picevent" src={eventEdit.event.pic} alt=""/>
                <button className="btn cal-cancel cal-close" onClick={cancelHandler}><img src={close} alt=""/></button>
            </header>
            <div className='eventEditElement--bottom'>
                <p> {eventEdit.event.title}</p>
                {eventEdit.event.description && (<p><span>Description: </span> {eventEdit.event.description}</p>)}
                {eventEdit.event.time && (<p><span>Time: </span> {eventEdit.event.time}</p>)}
                {eventEdit.event.location && (<p><span>Location: </span> {eventEdit.event.location}</p>)}
                <button onClick={deleteEventHandler} className="btn eventEditElement--trash">
                    <img src={trash} alt="" />
                </button>
            </div>
            {editEventFurther && (
                <AnimatePresence>
                    {editFurterElement}
                </AnimatePresence>
            )}
        </motion.div>
    )

    let viewMoreElement = (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={eventEditVariants}
            transition={eventEditTransition}     
            className='viewmore'  
            
        >
            <span className="viewmore--box"/>
            <header className="calendar-modal--dayedit--head">
                
                
                <button className="btn cal-cancel" onClick={cancelHandler}><img src={close} alt=""/></button>
            </header>
            
            <ul className="viewmore--list">
                {viewMoreEventsOptions.clicked && viewMoreEventsOptions.events.map((el, index) => {
                    return (
                        <li
                            onClick={(event) => editSingleEvent(event, el)}
                            key={index}
                            className="viewmore--list-item"
                        >
                            <p> {el.title}</p>
                            <img src={el.pic} alt=""/>
                        </li>
                    )
                })}
                        
                        
            </ul>

            
        </motion.div>
    )

    return (
        <Fragment>
            
            
            <ErrorModal error={error} clearError={clearError}/>
            {isLoading && <LoadingAnimation loading={isLoading}/>}

            {eventEdit.clicked && (
                <AnimatePresence>
                    {eventEditElement}
                </AnimatePresence>
            )}

            {viewMoreEventsOptions.clicked && (
                <AnimatePresence>
                    {viewMoreElement}
                </AnimatePresence>
            )}

                        {/* {isDayEdit.clicked && (
                                <AnimatePresence exitBeforeEnter>
                                    <DayEditModal 
                                    cancelHandler={cancelHandler} 
                                    inputHandler={inputHandler}
                                    moreOptionsHandler={moreOptionsHandler}
                                    submitDayEditHandler={submitDayEditHandler}
                                    dateChosen={isDayEdit.day.day}
                        />
                                </AnimatePresence>
                        )} */}

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

export default React.memo(CalendarModal)
