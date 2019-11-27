const express = require('express');

const { protect, restrictTo } = require('./../controllers/authController');

const {
    getAllReviews,
    getReview,
    createReview,
    deleteReview,
    updateReview,
    setTourUserIds
} = require('./../controllers/reviewController');

const router = express.Router({ mergeParams: true });

// just authenticated users can work with reviews
router.use(protect);

router
    .route('/')
    .get(getAllReviews)
    .post(restrictTo('user'), setTourUserIds, createReview);

router
    .route('/:id')
    .get(getReview)
    .delete(restrictTo('user', 'admin'), deleteReview)
    .patch(restrictTo('user', 'admin'), updateReview);

module.exports = router;
