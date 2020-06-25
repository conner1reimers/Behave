import React, {useState, useContext, useCallback, useEffect, useRef, useMemo } from 'react'
import Header from '../shared/Header/Header'
import Features from '../shared/Firstpage components/Features'
import { AnimatePresence } from 'framer-motion';
import MoneyAni from '../lotties/MoneyAni';
import Auth from '../Components/Auth';
import { AuthContext } from '../util/context/auth-context';
import { useHttpClient } from '../util/hooks/http-hook';
import ErrorModal from '../shared/ErrorModal/ErrorModal';
import { BudgetContext } from '../util/context/budget-context';
import { ResetContext } from '../util/context/reset-context';
import createExpensesArray from '../util/createExpenseArray';
import { getExpenseTotal } from '../util/myUtil';



const First = React.memo((props) => {
    const mountedRef = useRef(true);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    
    const {isLoading, error, clearError, sendRequest} = useHttpClient();

    const auth = useContext(AuthContext);

    const [userBudget, setUserBudget] = useState([]);
    const [userIncome, setUserIncome] = useState([]);
    const [userExpense, setUserExpense] = useState([]);
    
    const [userGoals, setUserGoals] = useState([]);


    const [passedUserBudget, setPassedUserBudget] = useState(null);

    const [userBudgetRemaining, setBudgetRemain] = useState(null);


    const [userIncomeTotal, setIncomeTotal] = useState(null);
    const [userExpenseTotal, setExpenseTotal] = useState(null);

    console.log(userExpense)
    const fetchBudget = useCallback(async () => {
        if (auth.isLoggedIn) {
            let response;
            let expenseTotal; 
            let expenseTotalArray;
            let incomeTotalArray; 
            let incomeTotal; 


            try {
                response = await sendRequest(`http://localhost:5000/api/budget/${auth.userId}`)
                if (!mountedRef.current) return null

                setUserBudget(response.budget);
                setPassedUserBudget({
                    budget: response.allBudgets,
                    income: response.allIncomes,
                    expense: response.allExpenses
                })
                
                setExpenseTotal(getExpenseTotal(response.expense))
                setUserExpense(createExpensesArray(response.expense));
                

                if ((!response.expense) || (response.expense.length < 1) ) {
                    setUserExpense([])
                } 

                if ((!response.income === 'not found') || (response.income.length < 1)) {
                    setUserIncome([])
                } else {
                    setUserIncome(response.income)
                }            
                

                incomeTotalArray = response.income.map((el) => {
                    return el.ammount
                });
                incomeTotal = incomeTotalArray.reduce((acc, cur) => acc + cur);

                setIncomeTotal(incomeTotal);


                let budgetRemaining;
                if (expenseTotal > 1 && response.budget) {
                    budgetRemaining = response.budget.ammount - expenseTotal;
                } else {
                    budgetRemaining = response.budget.ammount;
                };

                setBudgetRemain(budgetRemaining);

                

        } catch (err) {
            // ??????
            }}
        

    }, [auth.isLoggedIn, auth.userId])

    


    const fetchGoals = useCallback(async () => {
        if (auth.isLoggedIn) {
            let response;

            
            try {
                response = await sendRequest(`http://localhost:5000/api/goals/${auth.userId}`)
                if (!mountedRef.current) return null
                setUserGoals(response.goals)
                
        } catch (err) {
            // ??????
            }}
    }, [auth.isLoggedIn, auth.userId, sendRequest])






    useEffect(() => {
        fetchBudget();
        fetchGoals();

        return () => {
            mountedRef.current = false;
        }
    }, [auth.userId]);



    const setBug = useCallback((budget) => {
        setUserBudget(budget)
    }, [])

    const setExp = useCallback((budget) => {
        setUserExpense(budget)
    }, [])

    const setInc = useCallback((budget) => {
        setUserIncome(budget)
    }, [])



    const passData = useCallback(() => {
        props.passData(passedUserBudget)
    }, [props, passedUserBudget]);

    
    useEffect(() => {
        passData();
    }, [passedUserBudget, passData]);

    const renders = useRef(0);


    return (
        <BudgetContext.Provider
            value={{
                setBug,
                setExp: setUserExpense,
                setInc,
                budget: userBudget,
                expense: userExpense,
                income: userIncome,
                addedExpenseArray: userExpenseTotal,
                setAddedUpExpenses: setExpenseTotal,
                entireBudget: passedUserBudget

            }}
        >
            <ErrorModal error={error} clearError={clearError}/>
            {props.openLogin && <MoneyAni/>}

            {/* <div className="app-renders">renders: {renders.current++}</div> */}

        
            
            <Auth 
                    
                    openLogin={props.openLogin} 
                    toggleLogin={props.toggleLogin}
                    setOpenLogin={props.setOpenLogin}
                />
            


            <ResetContext.Provider 
                value = {{forceUpdate: forceUpdate}}
            >
            
            <Header 
                toggle={props.toggleLogin}
                userBudget={userBudget}
                userIncome={userIncome}
                userExpense={userExpense}
                isLoading={isLoading} 
                setUserBudget={setUserBudget}
                setUserExpense={setUserExpense}
                setUserIncome={setUserIncome}

                remain={userBudgetRemaining}

                userIncomeTotal={userIncomeTotal}
                userExpenseTotal={userExpenseTotal}
                setExpenseTotal={setExpenseTotal}

                goals={userGoals}
                setGoals={setUserGoals}

                entireBudget={passedUserBudget}
                setEntireBudget={setPassedUserBudget}

            />
            
            

            </ResetContext.Provider>

        </BudgetContext.Provider>
    )
})

export default First;