import React, { useState, useContext, Fragment, useCallback, useEffect} from 'react';
import { useHttpClient } from '../../../util/hooks/http-hook';
import { AuthContext } from '../../../util/context/auth-context';
import LoadingAnimation from '../../../lotties/LoadingAnimation/LoadingAnimation';
import ErrorModal from '../../ErrorModal/ErrorModal';
import HideEvent from './FirstEvent/HideEvent';
import BudgetModal from './BudgetModal';
import FirstEvent from './FirstEvent/FirstEvent';
import Media from 'react-media';
import ChosenGoals from './ChosenGoals';




const MiddleDash = React.memo((props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const auth = useContext(AuthContext)
    const { isLoading, error, sendRequest, clearError} = useHttpClient();

    const budgetOpenHandlr = () => {
        if(auth.isLoggedIn) {
            setModalOpen(true)
        } else {
            props.toggle()
        }
    }

    // FETCH NEXT UPCOMING EVENT
    const [hideUserEvent, setHideUserEvent] = useState(true);
    const [firstUserEvent, setFirstUserEvent] = useState(null);
    const fetchFirstEvent = useCallback(async () => {
        if (auth.isLoggedIn) {
            let response;
            try {
                response = await sendRequest(`http://localhost:5000/api/event/${auth.userId}`)
                setFirstUserEvent(response.event)
        } catch (err) {}
        
        }
    }, []);
    useEffect(() => {
        fetchFirstEvent()
    }, []);
    
    let budgetAmmount;
    let remaining;

    // MIDDLE SETUP
    const setupBudgetDisplay = () => {
        if (props.userBudget) {
            if (!props.userBudget.ammount) {
                budgetAmmount = (<span className='dollars-text needTo-createBudget'> Please Create a Budget for this Month<br></br>
                                    <button 
                                        onClick={budgetOpenHandlr} 
                                        className="edit-budgetBtn-noBudget" 
                                        type="button"> {"Edit Budget"}
                                    </button> 
                                </span>)
                remaining = null

            } else {
                let budgetAmmountDollars;
                if (props.expenseTotal > 0) {
                    budgetAmmountDollars = Number(parseFloat(props.userBudget.ammount) - props.expenseTotal
                    .toFixed(2)).toLocaleString('en', {minimumFractionDigits: 2});

                } else {
                    budgetAmmountDollars = Number(parseFloat(props.userBudget.ammount).toFixed(2))
                    .toLocaleString('en', {minimumFractionDigits: 2});
                }  
                budgetAmmount = <span className='dollars-text'>${budgetAmmountDollars} <br></br></span> 
                remaining = 'Remaining In Budget'
            };
        } else {
            budgetAmmount = (<span className='dollars-text needTo-createBudget'> Please Create a Budget for this Month <br></br>
            <div className="edit-div " onClick={budgetOpenHandlr}>
            <button className="edit-budgetBtn-noBudget"
                
                type="button"> {"<Edit Budget />"}
            </button> 
            </div>
        </span>)
            remaining = null
        }
    }

    let content;
    if (isLoading || props.isLoading) {
        content = (
        <Fragment>
            <LoadingAnimation loading={isLoading || props.isLoading}/>
        </Fragment>)
    } else {
        content = null;
    }
    setupBudgetDisplay();


    useEffect(() => {
        setupBudgetDisplay()

    }, [props.expenseTotal, props.userBudget])

    const hideEventHandler = useCallback(() => {
        setHideUserEvent((prevState) => !prevState);
    }, [])






   

    return (
        <div className="middle">
                <ErrorModal error={error} clearError={clearError}/>
                {content}

                <Media query="(min-height: 600px) and (min-width: 500px">

                {firstUserEvent && firstUserEvent.title && !props.hideUserEvent &&(
                    <FirstEvent 
                        firstUserEvent={firstUserEvent} 
                        hideEventHandler={hideEventHandler}
                        hideUserEvent={hideUserEvent}/>
                )}
                </Media>



                <Media query="(min-height: 600px) and (min-width: 500px">

                    {hideUserEvent && firstUserEvent && firstUserEvent.title &&  (
                        <HideEvent hideEventHandler={hideEventHandler}/>
                    )}
                </Media>


                <BudgetModal
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    userBudget={props.userBudget}
                    expense={props.userExpense}
                    setExp={props.setUserExpense}
                    setExpTotal={props.setExpenseTotal}
                />


 


                <h3 className="budget-heading"></h3>

                <div className="dollars-left">
                    <div className="dollar-before">
                        {budgetAmmount}
                        {remaining && <span onClick={budgetOpenHandlr} className="remain">{remaining}</span>}
                    </div>
                </div>

            {/* <Media query="(min-height: 600px) and (min-width: 750px">

                        <ChosenGoals goals={props.goals}/>
                
            </Media> */}

        </div>
    )
})

export default React.memo(MiddleDash, (prevProps, nextProps) => {
    if (prevProps.userBudget !== nextProps.userBudget) {
        return false
    }
    if (prevProps.expenseTotal !== nextProps.expenseTotal) {
        return false
    }
    return true;
})
