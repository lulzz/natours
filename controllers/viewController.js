const Tour = require('../models/toursModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
   // 1. get tour data from collection
   const tours = await Tour.find();

   // 2. buidl template
   // 3. render that temlate using tour data from 1
   res.status(200).render('overview', {
      tours
   });
});

exports.getTour = catchAsync(async (req, res, next) => {
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

   if (!tour) {
      return next(new AppError('There is no tour with that name.', 404));
   }

   // 2. Build template
   // 3. render template usind data from 1
   res.status(200).render('tour', {
      title: `${tour.name} Tour`,
      tour
   });
});

exports.login = catchAsync(async (req, res, next) => {
   res.status(200).render('login', {
      title: 'Log in to your account'
   });
});

exports.getAccount = (req, res) => {
   res.status(200).render('account', {
      title: 'Your account'
   });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
   // 1. find all bookings
   const bookings = await Booking.find({ user: req.user.id });

   // 2. find tours with the returned IDs
   const tourIDs = bookings.map(el => el.tour);
   const tours = await Tour.find({ _id: { $in: tourIDs } });

   res.status(200).render('overview', {
      title: 'My Tours',
      tours
   });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
   const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
         name: req.body.name,
         email: req.body.email
      },
      {
         new: true,
         runValidators: true
      }
   );

   res.status(200).render('account', {
      title: 'Your account',
      user: updatedUser
   });
});
