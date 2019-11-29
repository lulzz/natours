const Tour = require('../models/toursModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1. get tour data from collection
    const tours = await Tour.find();

    // 2. buidl template
    // 3. render that temlate using tour data from 1
    res.status(200).render('overview', {
        tours
    });
});

exports.getTour = catchAsync(async (req, res) => {
    // 1. get the data, for the requiested tour (including reviewws and guides)
    const tour = await Tour.findOne({ slug: req.params.slug })
        .populate({
            path: 'reviews',
            fields: 'review rating user'
        })
        .populate({
            path: 'guides',
            fields: 'role name'
        });

    // 2. Build template
    // 3. render template usind data from 1
    res.status(200).render('tour', {
        tour
    });
});
