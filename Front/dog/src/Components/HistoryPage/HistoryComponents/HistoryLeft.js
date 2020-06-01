import React from 'react'

const HistoryLeft = (props) => {
    let monthList = props.userData.budgets.map((el) => {
        console.log(el.month)
        return (
        <li className="history--month-item">
            {el.month}
        </li>
    )})
    
    return (
        <div className="history--sidebar">
            <h1 className="sidebar-head">Months: </h1>

            <ul className="history--month-list">
                {monthList}
            </ul>

        </div>
    )
}

export default HistoryLeft
