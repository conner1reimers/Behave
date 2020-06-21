import React, { Fragment, useState, useContext } from 'react'
import Media from 'react-media'
import Modal from '../../UIElements/Modal/Modal'
import BudgetEditor from '../../../Components/Budget/BudgetEditor'
import { AuthContext } from '../../../util/context/auth-context'
import { BudgetContext } from '../../../util/context/budget-context'
import { useHttpClient } from '../../../util/hooks/http-hook'
import BudgetFooter from '../../../Components/Budget/BudgetFooter';
import IncomeIcon from '../../../lotties/EditBudgetIcons/IncomeIcon'

const BudgetModal = (props) => {
    const [budgetEdit, setBudgetEdit] = useState(false);
    const [incomeEdit, setIncomeEdit] = useState(false);
    const [expenseEdit, setExpenseEdit] = useState(false);
    const [budgetState, setBudgetState] = useState(null);

    const editBudget = () => {
        setBudgetEdit(true);
        setJustSubmitted(false);
    }
    const editExpense = () => {
        setExpenseEdit(true);
        setJustSubmitted(false);

    }
    const editIncome = () => {
        setIncomeEdit(true);
        setJustSubmitted(false);

    }
    const passData = (data) => {
        // dad = data;
        setBudgetState(data);
    }
    const [justSubmitted, setJustSubmitted] = useState(null);

    const cancelHandler = () => {
        setBudgetEdit(false);
        props.setModalOpen((prevState) => !prevState);
        setExpenseEdit(false);
        setIncomeEdit(false);
        setJustSubmitted(false);


    }

    const goBack = (event) => {
        event.preventDefault();
        setBudgetEdit(false);
        setExpenseEdit(false);
        setIncomeEdit(false);
        setJustSubmitted(false);

    }
    const auth = useContext(AuthContext)
    const bugetContext = useContext(BudgetContext)
    const { isLoading, error, sendRequest, clearError} = useHttpClient();
    


    const backButton = (!budgetEdit && !incomeEdit && !expenseEdit) ? null
    : (
        <button onClick={goBack} className="back-btn">BACK</button>
    )


    let budgetAmt;
    const submitDataToBudget = async (event) => {
        event.preventDefault();

        const date = new Date()
        let month = (date.getMonth() + 1).toString()
        let year = date.getFullYear().toString();
        
        if (month.length <= 1) {
            month = '0' + month
        }
        const curMonth = month + year

        if (budgetEdit && !incomeEdit && !expenseEdit) {
            let response
            if (props.userBudget) {
                budgetAmt = props.userBudget.ammount

        }

        setJustSubmitted(false);
        try {
            response = await sendRequest('http://localhost:5000/api/budget', 'POST',
                JSON.stringify({
                    month: curMonth,
                    ammount: budgetState.inputs.ammount.value,
                    creator: auth.userId

                }),
                {
                    'Content-Type': 'application/json',
                    
                });
            setJustSubmitted(true);
            if (props.expenseTotal > 0) {
                budgetAmt = budgetState.inputs.ammount.value - props.expenseTotal;
                const newBudget = ({
                    month: curMonth,
                    ammount: budgetState.inputs.ammount.value,
                    creator: auth.userId
                });
                bugetContext.setBug(newBudget);
            } else {
                budgetAmt = budgetState.inputs.ammount.value;
                const newBudget = ({
                    month: curMonth,
                    ammount: budgetAmt,
                    creator: auth.userId
                });
                bugetContext.setBug(newBudget);
            };
            

        } catch(err) {}
        

    } else if (!budgetEdit && incomeEdit && !expenseEdit) {
        let response;
        setJustSubmitted(false);
        try {
            response = await sendRequest('http://localhost:5000/api/income', 'POST',
                JSON.stringify({
                    title: budgetState.inputs.category.value,
                    description: budgetState.inputs.description.value,
                    month: curMonth,
                    ammount: budgetState.inputs.income.value,
                    creator: auth.userId

                }),
                {
                    'Content-Type': 'application/json',
                    
                });
                setJustSubmitted(true);

        } catch(err) {}
    } else if (!budgetEdit && !incomeEdit && expenseEdit) {
        let response;
        setJustSubmitted(false);
        try {
            response = await sendRequest('http://localhost:5000/api/expense', 'POST',
                JSON.stringify({
                    title: budgetState.inputs.category.value,
                    description: budgetState.inputs.description.value,
                    month: curMonth,
                    ammount: budgetState.inputs.expense.value,
                    creator: auth.userId
                }),
                {
                    'Content-Type': 'application/json',
                    
                })
                setJustSubmitted(true);
                let expense = response.expense
                let expenses = props.userExpense
                expenses.push(expense)
                

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
                    ammount: foodExp
                },{ title: 'bills',
                    ammount: billExp
                },{ title: 'kids',
                    ammount: kidExp
                },{ title: 'tech',
                    ammount: techExp
                },{ title: 'supplies',
                    ammount: supplyExp
                },{ title: 'entertainment',
                    ammount: entertainExp
                },{ title: 'other',
                    ammount: otherExp
                }]
                totalExpenses = totalExpenses.filter(el => el.ammount !== 0)
                // bugetContext.setAddedUpExpenses(totalExpenses)

                let expenseTotalArray = expenses.map((el) => {
                    return el.ammount
                })

                bugetContext.setExp(totalExpenses)
                const added = expenseTotalArray.reduce((cur, acc) => {return cur + acc});
                bugetContext.setAddedUpExpenses(added)



                
        } catch(err) {}}};

    return (
        <Fragment>
            <Media query="(max-width: 450px)">
                    <Modal
                        cancel={cancelHandler} 
                        onSubmit={submitDataToBudget}
                        header={<div className="budget-head">Setup Your Budget! <IncomeIcon/> {backButton} </div>}
                        headerClass="budgetHead"
                        footer={<BudgetFooter 
                            passedData={passData}
                            budgetEdit={budgetEdit}
                            incomeEdit={incomeEdit}
                            expenseEdit={expenseEdit}  
                            justSubmitted={justSubmitted}
                            userBudget={props.userBudget}  

                            />}
                        show={props.modalOpen}
                        >
                            <BudgetEditor 
                                setModalOpen={props.setModalOpen} 
                                modalOpen={props.modalOpen}
                                editIncomeToggle={editIncome}
                                editBudgetToggle={editBudget}
                                editExpenseToggle={editExpense}
                                budgetEdit={budgetEdit}
                                incomeEdit={incomeEdit}
                                expenseEdit={expenseEdit}
                                passData={passData}
                                existingUserBudget={props.userBudget}  
                                existingUserIncome={props.userIncome}                            
                                existingUserExpense={props.userExpense}
                                justSubmitted={justSubmitted}                            
                            
                            /> 
                    </Modal>
                </Media>

                <Media query="(min-width: 450px)">
                    <Modal
                        cancel={cancelHandler} 
                        onSubmit={submitDataToBudget}
                        header={<div className="budget-head">Setup Your Budget! <IncomeIcon/> {backButton} </div>}
                        headerClass="budgetHead"
                        footer={<BudgetFooter 
                            passedData={passData}
                            budgetEdit={budgetEdit}
                            incomeEdit={incomeEdit}
                            expenseEdit={expenseEdit}  
                            justSubmitted={justSubmitted}
                            userBudget={props.userBudget}  

                            />}
                        show={props.modalOpen}
                        img="moni"
                        art
                        >
                            <BudgetEditor 
                                setModalOpen={props.setModalOpen} 
                                modalOpen={props.modalOpen}
                                editIncomeToggle={editIncome}
                                editBudgetToggle={editBudget}
                                editExpenseToggle={editExpense}
                                budgetEdit={budgetEdit}
                                incomeEdit={incomeEdit}
                                expenseEdit={expenseEdit}
                                passData={passData}
                                existingUserBudget={props.userBudget}  
                                existingUserIncome={props.userIncome}                            
                                existingUserExpense={props.userExpense}
                                justSubmitted={justSubmitted}                            
                            
                            /> 
                    </Modal>
                </Media> 
            </Fragment>
    )
}

export default BudgetModal;