const express = require('express');

const {
   getOverview,
   getTour,
   login,
   getAccount,
   updateUserData,
   getMyTours
} = require('./../controllers/viewController');

const { createBookingCheckout } = require('./../controllers/bookingController');
const { isLoggedIn, protect } = require('./../controllers/authController');

const router = express.Router();

router.get('/', createBookingCheckout, isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, login);

router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);

router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
