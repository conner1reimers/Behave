import React, { Fragment } from 'react'

const ToDoSingle = (props) => {
    let urg;

    if (props.urgency === 'important') {
        urg = 'Important'
    } else if (props.urgency === 'unimportant') {
        urg = 'Unimportant'
    } else if (props.urgency === 'medium') {
        urg = 'Med Importance'
    }


    return (
        <Fragment >
            <span className="taskWord">Task: </span>
            <span className="todo-task"><span className="task-box">{props.task}</span></span>
            <span className="todo-urgency">Urgencey: <span className={`todo-urgencyz ${props.urgencyClass}`}>{urg}</span></span>
        </Fragment>)
}

export default ToDoSingle
