import React, { useState, useCallback } from 'react';
import MiddleDash from './Dashboard/MiddleDash';
import DashLeft from './Dashboard/DashLeft';
import DashRight from './Dashboard/DashRight';
import Monies from '../../lotties/Monies/Monies';

const Header = (props) => {
    const [modalOpen, setModalOpen] = useState(false)

    // const passData = useCallback((budget, income, expense) => {
    //     const userTemplate = {
    //         budget,
    //         income,
    //         expense
    //     }
    //     setUserData(userTemplate)
    //     console.log(userData)
    // }, []);

    const todos = [{todo: 'hi'}, {todo: 'ho'}];


    
    return (
        <header className="dashboard-container">
            <DashLeft
                userExpense={props.userExpense}
                setUserExpense={props.setUserExpense}
                toggle={props.toggle} 

            />
            <MiddleDash 
                toggle={props.toggle} 
                setModalOpen={setModalOpen} 
                modalOpen={modalOpen} 
                userBudget={props.userBudget}
                userIncome={props.userIncome}
                userExpense={props.userExpense} 
                isLoading={props.isLoading} 
                setUserBudget={props.setUserBudget}
                setUserExpense={props.setUserExpense}
                setUserIncome={props.setUserIncome}

                reamain={props.remain}
                incomeTotal={props.userIncomeTotal}
                expenseTotal={props.userExpenseTotal}

            />
            <DashRight
                toggle={props.toggle} 
                todos={todos}
                goals={props.goals}
                setGoals={props.setGoals}

            />
            <Monies toggle={props.toggle} setModalOpen={setModalOpen}/>
        </header>
    )
}

export default Header
