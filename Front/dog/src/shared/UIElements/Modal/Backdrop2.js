import React from 'react';
import ReactDOM from 'react-dom';


const Backdrop = (props) => {
    return ReactDOM.createPortal(
        <div className="backdrop2" onClick={props.onClick}>

        </div>, document.getElementById('backdrop-hook2')
    )
}

export default Backdrop
