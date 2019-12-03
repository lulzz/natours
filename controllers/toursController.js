const Tour = require('./../models/toursModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const {
   deleteOne,
   updateOne,
   createOne,
   getOne,
   getAll
} = require('./handlerFactory');

exports.getTop5Tours = (req, res, next) => {
   req.query.limit = '5';
   req.query.sort = '-ratingsAverage,price';
   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
   next();
};

exports.getToursWithin = catchAsync(async (req, res, next) => {
   const { distance, latlng, unit } = req.params;
   const [lat, lng] = latlng.split(',');

   const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

   if (!lat || !lng) {
      return next(
         new AppError(
            'Please provide latitude and longitude in the format lat, lng.'
         ),
         400
      );
   }

   const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
   });

   res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
         data: tours
      }
   });
});

exports.getDistances = catchAsync(async (req, res, next) => {
   const { latlng, unit } = req.params;
   const [lat, lng] = latlng.split(',');

   const multiplier = unit === 'mi' ? 0.00062137119 : 0.001;

   if (!lat || !lng) {
      return next(
         new AppError(
            'Please provide latitude and longitude in the format lat, lng.'
         ),
         400
      );
   }

   const distances = await Tour.aggregate([
      {
         $geoNear: {
            near: {
               type: 'Point',
               coordinates: [lng * 1, lat * 1]
            },
            distanceField: 'distance',
            distanceMultiplier: multiplier
         }
      },
      {
         $project: {
            distance: 1,
            name: 1
         }
      }
   ]);

   res.status(200).json({
      status: 'success',
      data: {
         data: distances
      }
   });
});

exports.getAllTours = getAll(Tour);
exports.getTour = getOne(Tour, { path: 'reviews' });
exports.createTour = createOne(Tour);
exports.updateTour = updateOne(Tour);
exports.deleteTour = deleteOne(Tour);

exports.getTourStatistics = catchAsync(async (req, res, next) => {
   const stats = await Tour.aggregate([
      {
         $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
         $group: {
            _id: { $toUpper: '$difficulty' },
            numTours: { $sum: 1 },
            numRatings: { $sum: '$ratingsQuantity' },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
         }
      },
      {
         $sort: { avgPrice: 1 }
      }
   ]);

   res.status(200).json({
      status: 'success',
      data: {
         stats
      }
   });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
   const year = req.params.year * 1; // 2021

   const plan = await Tour.aggregate([
      {
         $unwind: '$startDates'
      },
      {
         $match: {
            startDates: {
               $gte: new Date(`${year}-01-01`),
               $lte: new Date(`${year}-12-31`)
            }
         }
      },
      {
         $group: {
            _id: { $month: '$startDates' },
            numTourStarts: { $sum: 1 },
            tours: { $push: '$name' }
         }
      },
      {
         $addFields: { month: '$_id' }
      },
      {
         $project: {
            _id: 0
         }
      },
      {
         $sort: { numTourStarts: -1 }
      },
      {
         $limit: 12
      }
   ]);

   res.status(200).json({
      status: 'success',
      data: {
         plan
      }
   });
});
