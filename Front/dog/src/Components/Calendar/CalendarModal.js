import React, { Fragment, useState, useEffect, useCallback } from 'react'
import getMonthYear, { getMonthYearNumbered, getMonthYearFromNumbered } from '../../util/getMonthYear'
import { AnimatePresence, motion } from 'framer-motion';

const dayVariants = {
    initial: {
        scale: .9,
        x: '200%'


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
    mass: 1.3,
    damping: 50,
    stiffness: 700,
    velocity: 3
    
}
const CalendarModal = (props) => {
    const curMonth = getMonthYear()
    const dateNow = getMonthYearNumbered();



    const daysOfTheWeek = [
        {day: '0', month: 'june'},
        {day: '01', month: 'june'},
        {day: '02', month: 'june'},
        {day: '03', month: 'june'},
        {day: '04', month: 'june'},
        {day: '05', month: 'june'},
        {day: '06', month: 'june'},
        {day: '04', month: 'june'},
        {day: '0304', month: 'june'},
        {day: '04', month: 'june'},
        {day: '04', month: 'june'},
        {day: '04', month: 'june'},
        {day: '0304', month: 'june'},
        {day: '04', month: 'june'},
        {day: '04', month: 'june'},
        {day: '04', month: 'june'},
        {day: '0304', month: 'june'},
        {day: '04', month: 'june'},
        {day: '04', month: 'june'},
        {day: '04', month: 'june'},
        {day: '0304', month: 'june'},
        {day: '04', month: 'june'},
        {day: '04', month: 'june'},
        {day: '0304', month: 'june'},
        {day: '04', month: 'june'},
        {day: '04', month: 'june'},
        {day: '04', month: 'june'},
        {day: '0304', month: 'june'},
        {day: '0304', month: 'june'},
        {day: '04', month: 'june'},
        {day: '04', month: 'june'},
        {day: '04', month: 'june'},
        {day: '0304', month: 'june'},
        {day: '04', month: 'june'},
        {day: '04', month: 'june'},
        
    ]
    
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    let daysMapped;
    let chosenMonthText;
    
    const [monthChosen, setMonthChosen] = useState(null);
    const [yearChosen, setYearChosen] = useState(null);

    useEffect(() => {
        setMonthChosen(currentMonth);
        setYearChosen(currentYear);
    }, []);


    //curDate = 52020 (june 2020)
    let events = {
        52020: {
            1: {
                title: 'Go to the store'
                }
        },
        62020: {
            2: {
                title: 'Go to the store'
                },
            6: {
                title: 'Help'
            }
        },
        102020: {
            2: {
                title: 'Go to the store'
                },
            6: {
                title: 'Help'
            }
        },
    }

    const [isDayEdit, setIsDayEdit] = useState({
        clicked: false,
        day: {}
    });

    const editDayHandler = (day) => {
        console.log(day)
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

    const submitDayEditHandler = (day) => {

    }

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
                
                if (events[curDate]) {
                    if (events[curDate][i + 1]) {
                        curEvent = events[curDate][i + 1].title
                    }
                }
                
                curMonthObject[i] = {
                    day: i + 1,
                    events: curEvent || [],
                    month: monthChosen,
                    year: yearChosen
                }
            }
        } else {
            for (let i = 0; i < daysInMonth + firstDay; i++) {
               
                if (i < firstDay) {
                    curMonthObject[i] = {
                        day: '',
                        events: [],
                        month: monthChosen,
                        year: yearChosen
                    }
                } else {
                    let curEvent = null;

                    if (events[curDate]) {
                        if (events[curDate][i - firstDay + 1]) {
                            curEvent = events[curDate][i - firstDay + 1].title
                        }
                    }
                    curMonthObject[i] = {
                        day: (i + 1) - firstDay,
                        events: curEvent || [],
                        month: monthChosen,
                        year: yearChosen
                    }
                }
            }
        }
        
            
        

        daysMapped = curMonthObject.map((day, index) => {
            let dayEditElement;
            console.log(isDayEdit)
            console.log(day)
                if (isDayEdit) {
                    if (isDayEdit.clicked === true && isDayEdit.day.day === day.day && isDayEdit.day.month === day.month && isDayEdit.day.year === day.year) {
                        dayEditElement = (
                            <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={dayVariants}
                            transition={dayTransition}
                            className="calendar-modal--dayedit"
                            >
                                <span>hi</span>
                            </motion.div>
                        )
                    }
                }
            return (
                <li
                    key={index}
                    className="calendar-modal--dayitem"
                    onClick={() => editDayHandler(day)}
                
                >
                    {isDayEdit.clicked && (
                        <AnimatePresence exitBeforeEnter>
                            {dayEditElement}
                        </AnimatePresence>
                    )}
                    <span className="calendar-modal--text">{day.day}</span>
                    <span>{day.events}</span>
                </li>
            )
        })

        console.log(curMonthObject)

        chosenMonthText = getMonthYearFromNumbered(monthChosen, yearChosen)

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
            <header className="cal-header">
                <h2 className="calendar-modal--head">Month of: {chosenMonthText} </h2>
                <button onClick={prevMonth}>PREV</button>
                <button onClick={nextMonth}>NEXT</button>

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
