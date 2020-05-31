import React, { useContext } from 'react'
import Lottie from 'react-lottie';
import animationData from './moneyStack.json';
import { AuthContext } from '../../util/context/auth-context';


const Monies = (props) => {
    let _lottieHeartRef;
    const auth = useContext(AuthContext)

    const budgetOpenHandlr = () => {
        if (auth.isLoggedIn) {
            props.setModalOpen(true)
        } else {
            props.toggle()
        }
        
    }
    
    const onRefLottie = (ref) => {
        _lottieHeartRef = ref;
    } 


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
        };

        return (
            <div className="money-stack" >
                        <div className="stacker">
                                    <Lottie
                                ref={onRefLottie}
                                options={defaultOptions}
                                height={100}
                                isClickToPauseDisabled={true}

                                width={100}
                                />
                        </div>

                        <div className="budget-btn-container">
                            <button onClick={budgetOpenHandlr} className="edit-btn learn-more">
                                Edit budgets
                            </button>
                        </div>

            </div>

        )
}
export default Monies;