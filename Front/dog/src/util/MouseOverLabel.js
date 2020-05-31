import React, { useState } from 'react'

const MouseOverLabel = (props) => {

    const [isVis, setIsVis] = useState(false);

    const complica = async () => {
        setTimeout(() => {
            
            setIsVis(false)

        }, 50);
    };

    const mouseOverHandler = (event) => {
        setIsVis(true)
  
       
    }
    const mouseLeaveHandler = (event) => {
        complica()
        
    }

    return (
        <div onMouseEnter={mouseOverHandler} onMouseLeave={mouseLeaveHandler}> {props.children}
            <span className={`${props.labelClass} ${isVis ? props.visibleClass : props.hiddenClass}`}>{props.label}</span>
        </div>
    )
}

export default MouseOverLabel;
