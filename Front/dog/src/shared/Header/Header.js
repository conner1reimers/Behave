import React, { useState, useCallback } from 'react';
import MiddleDash from './Dashboard/MiddleDash';
import DashLeft from './Dashboard/DashLeft';
import DashRight from './Dashboard/DashRight';
import Monies from '../../lotties/Monies/Monies';
import Media from 'react-media';
import ChosenGoals from './Dashboard/ChosenGoals';

const Header = (props) => {


    
    return (
        <header className="dashboard-container">
            <DashLeft
                userExpense={props.userExpense}
                setUserExpense={props.setUserExpense}
                toggle={props.toggle} 
                setExpenseTotal={props.setExpenseTotal}

                entireBudget={props.entireBudget}
                setEntireBudget={props.setEntireBudget}
                createExpensesArray={props.createExpensesArray}



            />
            <MiddleDash 
                toggle={props.toggle} 
                
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
                setExpenseTotal={props.setExpenseTotal}

                goals={props.goals}


            />
            <DashRight
                toggle={props.toggle} 
                todos={props.todos}
                setTodo={props.setTodo}
                goals={props.goals}
                setGoals={props.setGoals}

            />
            <Monies                     
                setUserExpense={props.setUserExpense}
                userBudget={props.userBudget} 
                toggle={props.toggle}
                expense={props.userExpense}
                setExpenseTotal={props.setExpenseTotal}

            />
            <Media query="(max-height: 1000px) and (max-width: 750px">
                <ChosenGoals goals={props.goals}/>
            </Media>
        </header>
    )
}

export default Header
