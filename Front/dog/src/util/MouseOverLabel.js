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
    let content;

    // if (props.label) {
    //     content = (

    //     )
    // }

    return (
        <div className={`${props.class}`} onMouseEnter={mouseOverHandler} onMouseLeave={mouseLeaveHandler}> 
            <span className={`${props.labelClass} ${isVis ? props.visibleClass : props.hiddenClass}`}>{props.label}</span>
            {props.children}
        </div>
    )
}

export default MouseOverLabel;
