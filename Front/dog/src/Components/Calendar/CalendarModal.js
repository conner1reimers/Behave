import React from 'react'
import getMonthYear from '../../util/getMonthYear'

const CalendarModal = () => {
    const curMonth = getMonthYear()

    const daysOfTheWeek = [
        {day: '0304', month: 'may'},
        {day: '04', month: 'may'},
        {day: '04', month: 'may'},
        {day: '04', month: 'may'},
        {day: '0304', month: 'may'},
        {day: '04', month: 'may'},
        {day: '04', month: 'may'},
        {day: '04', month: 'may'},
        {day: '0304', month: 'may'},
        {day: '04', month: 'may'},
        {day: '04', month: 'may'},
        {day: '04', month: 'may'},
        {day: '0304', month: 'may'},
        {day: '04', month: 'may'},
        {day: '04', month: 'may'},
        {day: '04', month: 'may'},
        {day: '0304', month: 'may'},
        {day: '04', month: 'may'},
        {day: '04', month: 'may'},
        {day: '04', month: 'may'},
        {day: '0304', month: 'may'},
        {day: '04', month: 'may'},
        {day: '04', month: 'may'},
        {day: '0304', month: 'may'},
        {day: '04', month: 'may'},
        {day: '04', month: 'may'},
        {day: '04', month: 'may'},
        {day: '0304', month: 'may'},
        

     ]

    const daysMapped = daysOfTheWeek.map((day) => {
        return (
            <li className="calendar-modal--dayitem">
                <span className="calendar-modal--text">{day.day}</span>
            </li>
        )
    })
    return (
        <div className="calendar-modal">
                <ul className="calendar-modal--days">
                    {daysMapped}
                </ul>
            
        </div>
    )
}

export default CalendarModal
