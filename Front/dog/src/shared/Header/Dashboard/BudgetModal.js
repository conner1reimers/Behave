import React, { Fragment, useState, useContext, useEffect, useRef } from 'react'
import Media from 'react-media'
import Modal from '../../UIElements/Modal/Modal'
import BudgetEditor from '../../../Components/Budget/BudgetEditor'
import { AuthContext } from '../../../util/context/auth-context'
import { BudgetContext } from '../../../util/context/budget-context'
import { useHttpClient } from '../../../util/hooks/http-hook'
import BudgetFooter from '../../../Components/Budget/BudgetFooter';
import IncomeIcon from '../../../lotties/EditBudgetIcons/IncomeIcon'
import LoadingAnimation from '../../../lotties/LoadingAnimation/LoadingAnimation'
import createExpensesArray from '../../../util/createExpenseArray'
import { ResetContext } from '../../../util/context/reset-context'
import { uuid } from 'uuidv4'
import {produce} from 'immer'
import { getExpenseTotal } from '../../../util/myUtil'


const BudgetModal = (props) => {
    const [budgetEdit, setBudgetEdit] = useState(false);
    const [incomeEdit, setIncomeEdit] = useState(false);
    const [expenseEdit, setExpenseEdit] = useState(false);
    const [budgetState, setBudgetState] = useState(null);

    let reset = useContext(ResetContext);
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

    const mountedRef = useRef(true);
    useEffect(() => {

        return(() => {
            mountedRef.current = false;
        })
    }, [])

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
            let response;

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
                if (!mountedRef.current) return null;

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
                if (!mountedRef.current) return null;
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
                if (!mountedRef.current) return null;
                setJustSubmitted(true);

                props.setExp((prevState) => {
                    
                    return produce(prevState, (draftState) => {
                        if (draftState.length >= 1) {
                            let check = false;
                            prevState.map((el, indx) => {
                                if (response.expense.title === el.title) {
                                    draftState[indx].ammount += response.expense.ammount;
                                    check = true;
                                } else if ((indx === draftState.length - 1) && !check) {
                                    draftState[indx + 1] = {
                                        title: response.expense.title, 
                                        ammount: response.expense.ammount,
                                        id: uuid()
                                    }  
                                };
                            })
                        } else {
                            draftState.push({
                                title: response.expense.title, 
                                ammount: response.expense.ammount,
                                id: uuid()
                            })
                        }

                    })
                })

                props.setExpTotal((prevState) => {
                    if (prevState > 0) {
                        return prevState += response.expense.ammount
                    } else {
                        return response.expense.ammount
                    }

                    
                })


                // props.setExp((prevState) => {
                //     let check = false;
                //     if(prevState.length >= 1) {
                //         prevState.map((el, indx) => {
                            
                //             if (response.expense.title === el.title) {
                //                 prevState[indx].ammount += response.expense.ammount
                //                 check = true;
                //             } else if ((indx === prevState.length - 1) && !check) {
                //                 prevState[indx + 1] = {
                //                     title: response.expense.title, 
                //                     ammount: response.expense.ammount,
                //                     id: uuid()
                //                 }
                                
                //             };
                //         }) 
                //         return [...prevState]
                //     } 
                //     else {
                //         return [...prevState, {
                //             title: response.expense.title,
                //             ammount: response.expense.ammount,
                //             id: uuid()
                //         }]
                //     }

                // })
                


                
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
                            {isLoading && <LoadingAnimation loading={isLoading} />}
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
                            {isLoading && <LoadingAnimation loading={isLoading} />}

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
