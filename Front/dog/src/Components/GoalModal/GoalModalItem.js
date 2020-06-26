import React, { useContext, useEffect, Fragment, useCallback } from 'react'
import { useHttpClient } from '../../util/hooks/http-hook';
import { AuthContext } from '../../util/context/auth-context';
import ErrorModal from '../../shared/ErrorModal/ErrorModal';
import businesss from '../../shared/Header/Dashboard/dashLeftImgs/businesss.png';

const GoalModalItem = (props) => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const auth = useContext(AuthContext)
    
    let goalClass;


    
    
    const chooseGoal = useCallback(async (chosen, id, title) => {
        
        let response
        try {
            response = await sendRequest(
                `http://localhost:5000/api/goals/${id}`,
                'PATCH',
                JSON.stringify({
                    chosen: chosen,
                    creator: auth.userId
                }),
                {'Content-Type': 'application/json'});

            let newArray = props.goals.filter((goal) => {
                return goal._id !== id
            })
            let newGoal
            if (chosen === false) {
                newGoal = {
                    _id: id,
                    title,
                    chosen: true,
                    creator: auth.userId
                }
                newArray.push(newGoal)
            } else {
                newGoal = {
                    _id: id,
                    title,
                    chosen: false,
                    creator: auth.userId

                }
                newArray.push(newGoal)
            }
            props.setGoals(newArray)

        

        } catch {}
    })


    let goalList = null;
    console.log(props.goals)

    const setGoals = (goal) => {
        if (props.goals) {
            goalList = goal.map((goal, index) => {
                if (goal.chosen) {
                    goalClass = 'goal-item--chose'
                } 
                else {goalClass = null;}
                return (
                <li 
                    key={goal._id}
                    onClick={() => chooseGoal(goal.chosen, goal._id, goal.title)}
                    className={`goal-item ${goalClass}`}
                >
                    <p> 
                        <img src={businesss} alt="" />
                        <span>{goal.title}</span>
                        </p>
                </li>
                )
            })
        }
    }

    setGoals(props.goals)
    

    useEffect(() => {
        setGoals(props.goals)
    }, [props.goals])

    

    return (
        <Fragment>
        <ErrorModal error={error} clearError={clearError}/>

        <ul className="goal-modal--list">
            {goalList}
        </ul>
        </Fragment>
    )
}

export default React.memo(GoalModalItem)
