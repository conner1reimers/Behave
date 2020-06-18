import React from 'react';
import ReactDOM from 'react-dom';


const Backdrop = (props) => {
    return ReactDOM.createPortal(
        <div className={`backdrop ${props.backdropClass}`} onClick={props.onClick}>

        </div>, document.getElementById('backdrop-hook')
    )
}

export default Backdrop
