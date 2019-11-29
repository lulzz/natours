const path = require('path');
const morgan = require('morgan');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// routers
const usersRouter = require('./routes/usersRoutes');
const toursRouter = require('./routes/toursRoutes');
const reviewsRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1. GLOBAL MIDDLEWARES

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// set security http headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// limit requiest from same api
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message:
        'Too many requests from this IP, please try again later in an hour!'
});

app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// data sanitizatioin against NoSQL query injection
app.use(mongoSanitize());

// data danitization against XSS
app.use(xss());

// prevent parameter polution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuality',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);

// testing middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// routes
app.use('/', viewRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);

// not found routes, 404
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// global middleware for errors
app.use(globalErrorHandler);

module.exports = app;
