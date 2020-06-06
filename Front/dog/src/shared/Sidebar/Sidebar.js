import React, { useContext, Fragment, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import Lottie1 from './LottieLinks/Lottie1';
import Lottie2 from './LottieLinks/Lottie2';
import Lottie6 from './LottieLinks/Lottie6';

import Lottie4 from './LottieLinks/Lottie4';
import Lottie5 from './LottieLinks/Lottie5';
import { AuthContext } from '../../util/context/auth-context';

const Sidebar = (props) => {
    const [content, setContent] = useState(null)

    const setItems = () => {
        
        setTimeout(() => {
            setContent(
                <div className="sidebar">
                    
                    <div className="sidebar-logo">
                        <NavLink to={`/${props.userId}/home`}><Lottie6/></NavLink>
                    </div>
        
                    <div className="sidebar-links">
                        <ul className="nav-links">
                            {props.isLoggedIn &&
                            <Fragment>
                                <li className="link">
                                    <NavLink to={`/${props.userId}/history`}><Lottie1/></NavLink>
                                </li>
        
                                <li className="link">
                                    <NavLink to="/pages"><Lottie2/></NavLink>
                                </li>
        
                                <li className="link">
                                    <NavLink to="/pages"><Lottie4/></NavLink>
                                </li>
        
                            </Fragment>}
        
                            <li onClick={props.toggle} className="link">
                                <Lottie5/>
                            </li>
                            {/* <Lottie3/> */}
                        </ul>
                    </div>
        
        
        
                </div>
            )
        }, 100);

    }

    useEffect(() => {
        setItems()
    }, [props.userId, props.isLoggedIn])
    
    
    return content
}



export default Sidebar
