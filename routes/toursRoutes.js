const express = require('express');

const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    getTop5Tours,
    getTourStatistics,
    getMonthlyPlan
} = require('./../controllers/toursController');

const { protect, restrictTo } = require('./../controllers/authController');

const router = express.Router();

router.route('/top-5-cheap').get(getTop5Tours, getAllTours);
router.route('/tour-stats').get(getTourStatistics);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router
    .route('/')
    .get(protect, getAllTours)
    .post(createTour);

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(protect, protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
