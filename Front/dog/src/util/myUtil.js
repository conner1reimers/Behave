

export const optionHandler = (state, setState, load, compareValue) => {
    
    
    if (state.clicked) {
        if (state.data[compareValue] === load[compareValue]) {
            setState((prevState) => {
                return {
                    ...prevState,
                    clicked: false,
                    }
            })
        } else {
            setState({
                clicked: true,
                data: load
            })
        }
    } else {
        setState({
            clicked: true,
            data: load
        })
    }
}

export const getExpenseTotal = (expense) => {
    let expenseTotalArray = expense.map((el) => {
        return el.ammount
    })
    return expenseTotalArray.reduce((acc, cur) => acc + cur);
}

