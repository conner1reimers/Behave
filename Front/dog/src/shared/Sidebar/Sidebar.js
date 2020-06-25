import React, { useContext, Fragment, useState, useEffect, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import Lottie1 from './LottieLinks/Lottie1';
import Lottie2 from './LottieLinks/Lottie2';
import Lottie6 from './LottieLinks/Lottie6';

import Lottie4 from './LottieLinks/Lottie4';
import Lottie5 from './LottieLinks/Lottie5';
import { AuthContext } from '../../util/context/auth-context';

const Sidebar = React.memo((props) => {
    const [content, setContent] = useState(null)

    const setItems = useCallback(() => {
        
        setTimeout(() => {
            setContent(
                <div className="sidebar">
                    
                    
                    <div className="sidebar-links">
                        <ul className="nav-links">
                            {props.isLoggedIn &&
                            <Fragment>
                                <li className="link">
                                    <NavLink to={`/${props.userId}/history`}><Lottie1/></NavLink>
                                </li>

                                <li className="link">
                                    <NavLink to={`/${props.userId}/newpage`}><Lottie1/></NavLink>
                                </li>
        
                                <li className="link">
                                    <NavLink to={`/${props.userId}/todo`}><Lottie2/></NavLink>
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

    }, [props.isLoggedIn, props.userId, props.toggle]);

    useEffect(() => {
        setItems()
    }, [props.userId, props.isLoggedIn, setItems])
    
    
    return content
})



export default Sidebar
