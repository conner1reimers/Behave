import React, { useContext, useState } from 'react'

import { AuthContext } from '../../util/context/auth-context';
import BudgetModal from '../../shared/Header/Dashboard/BudgetModal';
import Stacker from './Stacker';


const Monies = (props) => {
    const auth = useContext(AuthContext)

    const budgetOpenHandlr = () => {
        if (auth.isLoggedIn) {
            setModalOpen(true)
        } else {
            props.toggle()
        }
        
    }
    const [modalOpen, setModalOpen] = useState(false);




    

        return (
            <div className="money-stack" >
                        <Stacker />
                        

                        <div className="budget-btn-container">
                            <button onClick={budgetOpenHandlr} className="edit-btn learn-more">
                                Edit budgets
                            </button>
                        </div>

                        <BudgetModal 
                            setExp={props.setUserExpense}
                            userBudget={props.userBudget} 
                            modalOpen={modalOpen} 
                            setModalOpen={setModalOpen}
                            expense={props.expense}
                            setExpTotal={props.setExpenseTotal}
                            />

            </div>

        )
}
export default Monies;