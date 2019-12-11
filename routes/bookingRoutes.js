const express = require('express');

const { getCheckoutSession } = require('./../controllers/bookingController');

const { isLoggedIn, protect } = require('./../controllers/authController');

const router = express.Router();

router.get('/checkout-session/:tourId', protect, getCheckoutSession);

module.exports = router;
