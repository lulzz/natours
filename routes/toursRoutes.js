const express = require('express');

const {
   getAllTours,
   createTour,
   getTour,
   updateTour,
   deleteTour,
   getTop5Tours,
   getTourStatistics,
   getMonthlyPlan,
   getToursWithin,
   getDistances,
   resizeTourImages,
   uploadTourImages
} = require('./../controllers/toursController');

const reviewRouter = require('./../routes/reviewRoutes');

const { protect, restrictTo } = require('./../controllers/authController');

const router = express.Router();

router.route('/top-5-cheap').get(getTop5Tours, getAllTours);
router.route('/tour-stats').get(getTourStatistics);
router
   .route('/monthly-plan/:year')
   .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
   .route('/tours-within/:distance/center/:latlng/unit/:unit')
   .get(getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
   .route('/')
   .get(getAllTours)
   .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
   .route('/:id')
   .get(getTour)
   .patch(
      protect,
      restrictTo('admin', 'lead-guide'),
      uploadTourImages,
      resizeTourImages,
      updateTour
   )
   .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
