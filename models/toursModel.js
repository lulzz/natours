const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, 'A tour must have a name'],
         unique: true,
         trim: true,
         maxlength: [
            40,
            'A tour name must have less or equal then 40 characthers'
         ],
         minlength: [
            10,
            'A tour name must have more or equal then 10 characthers'
         ]
      },
      slug: String,
      duration: {
         type: Number,
         required: [true, 'A tour must have a druation']
      },
      maxGroupSize: {
         type: Number,
         required: [true, 'A tour must have a group size']
      },
      difficulty: {
         type: String,
         required: [true, 'A tour must have a difficulty'],
         enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
         }
      },
      ratingsAverage: {
         type: Number,
         default: 4.5,
         min: [1, 'Rating must aboe 1.0'],
         max: [5, 'Rating mus be below 5.0'],
         set: val => Math.round(val * 10) / 10
      },
      ratingsQuantity: {
         type: Number,
         default: 0
      },
      rating: {
         type: Number,
         default: 4.5
      },
      price: {
         type: Number,
         required: [true, 'A tour must have a price']
      },
      priceDiscount: {
         type: Number,
         validate: {
            validator: function(val) {
               console.log(val);
               return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
         }
      },
      summary: {
         type: String,
         trim: true,
         required: [true, 'Tour must have a description']
      },
      description: {
         type: String,
         trim: true
      },
      imageCover: {
         type: String,
         required: [true, 'A tour must have a cover image']
      },
      images: [String],
      photo: String,
      createdAt: {
         type: Date,
         default: Date.now,
         select: false
      },
      startDates: [Date],
      secretTour: {
         type: Boolean,
         default: false
      },
      startLocation: {
         // GeoJSON
         type: {
            type: String,
            default: 'Point',
            enum: ['Point']
         },
         coordinates: [Number],
         address: String,
         description: String
      },
      locations: [
         {
            type: {
               type: String,
               default: 'Point',
               enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
         }
      ],
      guides: [
         {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
         }
      ]
   },
   {
      // options
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
   }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: -1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function() {
   return this.duration / 7;
});

// Virtual Populate
tourSchema.virtual('reviews', {
   ref: 'Review', // name of the model that you want to reference
   foreignField: 'tour',
   localField: '_id'
});

tourSchema.pre('save', function(next) {
   this.slug = slugify(this.name, { lower: true });
   next();
});

tourSchema.pre(/^find/, function(next) {
   this.find({ secretTour: { $ne: true } });
   this.start = Date.now();
   next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
