const morgan = require('morgan');
const express = require('express');

const usersRouter = require('./routes/usersRoutes');
const touresRouter = require('./routes/touresRoutes');

const app = express();

// 1. MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/tours', touresRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;
