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
import { uuid } from 'uuidv4';



const First = React.memo((props) => {
    const mountedRef = useRef(true);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    
    const {isLoading, error, clearError, sendRequest} = useHttpClient();

    const auth = useContext(AuthContext);

    const [userBudget, setUserBudget] = useState(null);
    const [userIncome, setUserIncome] = useState(null);
    const [userExpense, setUserExpense] = useState(null);
    
    const [userGoals, setUserGoals] = useState(null);


    const [passedUserBudget, setPassedUserBudget] = useState(null);

    const [userBudgetRemaining, setBudgetRemain] = useState(null);


    const [userIncomeTotal, setIncomeTotal] = useState(null);
    const [userExpenseTotal, setExpenseTotal] = useState(null);


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
                expenseTotalArray = response.expense.map((el) => {
                    return el.ammount
                })
                expenseTotal = expenseTotalArray.reduce((acc, cur) => acc + cur);
                

                if ((!response.expense) || (response.expense.length < 1) ) {
                    setUserExpense([{}])
                } 

                if ((!response.income === 'not found') || (response.income.length < 1)) {
                    setUserIncome([{}])
                } else {
                    setUserIncome(response.income)
                }            
                

                incomeTotalArray = response.income.map((el) => {
                    return el.ammount
                });
                incomeTotal = incomeTotalArray.reduce((acc, cur) => acc + cur);

                setIncomeTotal(incomeTotal);

                let expenses = createExpensesArray(response.expense);

                setUserExpense(expenses);
                setExpenseTotal(expenseTotal);

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

    const createExpensesArray = useCallback((expenses) => {
        if (expenses.length > 0) {
            let techExp = expenses.map((el) => {
                if (el.title === 'tech') {
                    return el
                } else {
                    return {title: 'tech', ammount: 0}}
            });
            let kidExp = expenses.map((el) => {
                if (el.title === 'kids') {
                    return el
                } else {
                    return {title: 'kids', ammount: 0}}
            });
            let billExp = expenses.map((el) => {
                if (el.title === 'bills') {
                    return el
                } else {
                    return {title: 'bills', ammount: 0}}
            });
            let entertainExp = expenses.map((el) => {
                if (el.title === 'entertainment') {
                    return el
                } else {
                    return {title: 'entertainment', ammount: 0}}
            });
            let foodExp = expenses.map((el) => {
                if (el.title === 'food') {
                    return el
                } else {
                    return {title: 'food', ammount: 0}}
            });
            let otherExp = expenses.map((el) => {
                if (el.title === 'other') {
                    return el
                } else {
                    return {title: 'other', ammount: 0}
                }
            });
            let supplyExp = expenses.map((el) => {
                if (el.title === 'supplies') {
                    return el
                } else {
                    return {title: 'supplies', ammount: 0}
                }
            });
    
            techExp = techExp.filter(el => el !== undefined).map(el => el.ammount).reduce((acc, cur) => acc + cur)
            kidExp = kidExp.filter(el => el !== undefined).map(el => el.ammount).reduce((acc, cur) => acc + cur)
            foodExp = foodExp.filter(el => el !== undefined).map(el => el.ammount).reduce((acc, cur) => acc + cur)
            entertainExp = entertainExp.filter(el => el !== undefined).map(el => el.ammount).reduce((acc, cur) => acc + cur)
            supplyExp = supplyExp.filter(el => el !== undefined).map(el => el.ammount).reduce((acc, cur) => acc + cur)
            otherExp = otherExp.filter(el => el !== undefined).map(el => el.ammount).reduce((acc, cur) => acc + cur)
            billExp = billExp.filter(el => el !== undefined).map(el => el.ammount).reduce((acc, cur) => acc + cur)
    
            let totalExpenses = [
            {   title: 'food',
                ammount: foodExp,
                id: uuid()
            },{ title: 'bills',
                ammount: billExp,
                id: uuid()
            },{ title: 'kids',
                ammount: kidExp,
                id: uuid()
            },{ title: 'tech',
                ammount: techExp,
                id: uuid()
            },{ title: 'supplies',
                ammount: supplyExp,
                id: uuid()
            },{ title: 'entertainment',
                ammount: entertainExp,
                id: uuid()
            },{ title: 'other',
                ammount: otherExp,
                id: uuid()
            }].filter(el => el.ammount !== 0)
    
            return totalExpenses;
        }
        
    }, []);


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
                setExp,
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
                setExpenseTotal={setExpenseTotal}

                userIncomeTotal={userIncomeTotal}
                userExpenseTotal={userExpenseTotal}
                setExpenseTotal={setExpenseTotal}

                goals={userGoals}
                setGoals={setUserGoals}

                entireBudget={passedUserBudget}
                setEntireBudget={setPassedUserBudget}
                createExpensesArray={createExpensesArray}

            />
            
            

            </ResetContext.Provider>

        </BudgetContext.Provider>
    )
})

export default First;