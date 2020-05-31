const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const usersRoutes = require('./routes/users-routes');
const budgetRoutes = require('./routes/budget-routes');
const incomeRoutes = require('./routes/income-routes');
const expenseRoutes = require('./routes/expense-routes');
const goalsRoutes = require('./routes/goals-routes')
const todoRoutes = require('./routes/todo-routes')

const HttpError = require('./models/http-error');

const app = express();


app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});


app.use('/api/users', usersRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/todo', todoRoutes);





app.use((req, res, next) => {
    const error = new HttpError('That route was not found', 404);
    throw error;
})

app.use((error, req, res, next) => {

    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500); // 500 means something went wrong on the server
    res.json({ message: error.message || 'THERE WAS AN ERROR' })
});

mongoose
    .connect('mongodb+srv://concon:Lj68xZ0F1fLxpegW@cluster0-pnh1k.mongodb.net/test?retryWrites=true&w=majority')
    .then(() => {
        console.log('Database Connected!')
        app.listen(5000);
    })
    .catch(err => {
        console.log(err)
    })

