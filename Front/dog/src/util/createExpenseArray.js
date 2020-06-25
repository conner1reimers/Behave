import { uuid } from 'uuidv4';
import { useCallback } from 'react';

const createExpensesArray = (expenses) => {
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
    } else {
        return []
    }
    
};

export default createExpensesArray;