import { createContext } from "react";

export const BudgetContext = createContext(
    {
        budget: 'not found',
        expense: 'not found',
        income: 'not found',
        addedExpenseArray: [],
        todos: [],
        setBug: () => {},
        setInc: () => {},
        setExp: () => {},
        setTodos: () => {},
        setAddedUpExpenses: () => {},


    }
)