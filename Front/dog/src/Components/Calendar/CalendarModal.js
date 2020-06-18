import React, { Fragment, useState, useEffect, useCallback, useContext } from 'react'
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
                monthYear: curDate,
                day: day,
                title: formState.inputs.title.value,
                creator: auth.userId,
                category: formState.inputs.category.value,
                time: formState.inputs.time.value,
                location: formState.inputs.location.value,
                description: formState.inputs.description.value,

            }),
            {'Content-Type': 'application/json'}
            );

            setMonthEvents((prevState) => {
                if (prevState[curDate]) {
                    console.log(prevState[curDate])
                    if (prevState[curDate][day] && isDayEdit.day.events) {
                        prevState[curDate][day].push({
                            title: formState.inputs.title.value,
                            category: formState.inputs.category.value
                        })
                        return {
                            ...prevState,
                            
                        }
                    } else {
                            prevState[curDate][isDayEdit.day.day] = [{
                            title: formState.inputs.title.value,
                            category: formState.inputs.category.value
                            }]
                            return {
                                ...prevState,
                                
                            }
                    }
                } else {
                        prevState[curDate][isDayEdit.day.day] = [{
                            title: formState.inputs.title.value,
                            category: formState.inputs.category.value
                    }]
                    return {
                        ...prevState,
                        
                    }
                    
                }
            })
            console.log(response)
            
            
                                   
        } catch (err) {
            console.log(err)

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
    };

    const editSingleEvent = (event, item) => {
        event.preventDefault();
        event.cancelBubble = true
        event.stopPropagation()
        setIsDayEdit({
            clicked: false,
            event: {}
        })
        setEditEventFurther(false);

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
                    default: categoryEventImg = dot; break;
                }                
                setEventEdit({
                    clicked: true,
                    event: {
                        title: item.title,
                        category: item.category,
                        time: item.time,
                        description: item.description,
                        location: item.location,
                        pic: categoryEventImg
                        
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
                default: categoryEventImg = dot; break;
            }            
            setEventEdit({
                clicked: true,
                event: {
                    title: item.title,
                    category: item.category,
                    time: item.time,
                    description: item.description,
                    location: item.location,
                    pic: categoryEventImg
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
                                    title: el.title,
                                    category: el.category,
                                    time: el.time,
                                    description: el.description,
                                    location: el.location,
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
                                        title: el.title,
                                        category: el.category,
                                        time: el.time,
                                        description: el.description,
                                        location: el.location,
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
                                    let label = (
                                        <Fragment>
                                            <h1>{el.category}</h1>
                                            <p>{el.title}</p>
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
                                        default: console.log('default'); categoryImg = dot; break;
                                    }

                                        return (
                                            <MouseOverLabel
                                                label={label}
                                                labelClass="edit-label cal-mouseover"
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
                                    })}

                                {day.events && day.events.length >= 3 && eventz.map((el, index) => {
                                    if (index <= 1) {

                                        let label = (
                                            <Fragment>
                                                <h1>{el.category}</h1>
                                                <p>{el.title}</p>
                                            </Fragment>
                                        )
                                        let categoryImg;
                                    switch (el.category) {
                                        case 'work': categoryImg = work; break;
                                        case 'family': categoryImg = family; break;
                                        case 'other': categoryImg = other; break;
                                        case 'travel': categoryImg = travel; break;
                                        case 'friend': console.log('hi'); categoryImg = friend; break;
                                        case 'bday': categoryImg = bday; break;
                                        default: console.log('default'); categoryImg = dot; break;
                                    }
                                        return (
                                            <MouseOverLabel
                                                label={label}
                                                labelClass="edit-label cal-mouseover"
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
                                    } else {
                                        let label = (
                                            <Fragment>
                                                <h1>{el.category}</h1>
                                                <p>{el.title}</p>
                                            </Fragment>
                                        )
                                        return (
                                            <MouseOverLabel
                                                label={label}
                                                labelClass="edit-label cal-mouseover"
                                                visibleClass="vis"
                                                hiddenClass="hid"
                                                key={index}
                                            >
                                            <li
                                            key={index}
                                            className="btn calendar-modal--event-item--btn">
                                                <button className="btn calendar-modal--event-item--btn">....View more</button>
                                            </li>
                                            </MouseOverLabel>
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

    // let content;
    // if (isLoading) {
    //     content = (
    //     <Fragment>
    //         <LoadingAnimation loading={isLoading}/>
    //     </Fragment>)
    // } else {
    //     content = null;
    // }

    const submitEventEditHandler = async () => {

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
            <form onSubmit={submitEventEditHandler} className="calendar-modal--dayedit--form">

                <Input
                name="New Caption"
                id="location"
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
                id="location"
                onInput={inputHandler}
                validator={VALIDATOR_NONE()}
                errorText="Need atleast 1 character"
                type="text"
                class="calendar-modal--dayedit--input calinput-not"
                errorClass="error-notNum"                                    
                />
                <Input
                name="New Time"
                id="location"
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
            <header className="calendar-modal--dayedit--head">
                <h1>{eventEdit.event.category}</h1>
                <MouseOverLabel
                    label='Edit'
                    labelClass="edit-label cal-mouseover"
                    visibleClass="vis"
                    hiddenClass="hid"
                >
                    <button onClick={editEventFurtherHandler} className="btn cal-cancel"><img src={pencil} alt=""/></button>
                </MouseOverLabel>
                <img className="cal-eventedit-img" src={eventEdit.event.pic} alt=""/>
                <button className="btn cal-cancel" onClick={cancelHandler}><img src={close} alt=""/></button>
            </header>
            <div>
                <p>{eventEdit.event.title}</p>
                {eventEdit.event.description && (<p>Description: {eventEdit.event.description}</p>)}
                {eventEdit.event.time && (<p>Time: {eventEdit.event.time}</p>)}
                {eventEdit.event.location && (<p>Location: {eventEdit.event.location}</p>)}
            </div>
            {editEventFurther && (
                <AnimatePresence>
                    {editFurterElement}
                </AnimatePresence>
            )}
        </motion.div>
    )

    return (
        <Fragment>
            
            {eventEdit.clicked && (
                <AnimatePresence>
                    {eventEditElement}
                </AnimatePresence>
            )}
            <ErrorModal error={error} clearError={clearError}/>
            {isLoading && <LoadingAnimation loading={isLoading}/>}

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
