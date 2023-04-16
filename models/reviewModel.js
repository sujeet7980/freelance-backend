const mongoose = require('mongoose');
const Tour= require('./ProjectModel')
const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, 'review cannot be empty !!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      require: [true, 'Review most belong to a user'],
    },
    client: {
      type: mongoose.Schema.ObjectId,
      ref: 'client',
      require: [true, 'Review most belong to a client'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.index({client:1,user:1},{unique : true});
reviewSchema.pre(/^find/,function(next){
  // this.populate({
  //   path : 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select : 'name photo'
  // })
  this.populate({
      path: 'user',
      select : 'profile title'
    })
  next();
});

reviewSchema.statics.calcAverageRating = async function(userId) {
  const stats = await this.aggregate([
    {
      $match : {user : userId}
    },
    {
      $group:{
        _id : '$tour',
        nRating: { $sum :1},
        avgRating : {$avg : '$rating'}
      }
    }
  ])
  if(stats.length>0){
  await User.findByIdAndUpdate(userId,{
    ratingQuantity :  stats[0].nRating,
    ratingsAverage : stats[0].avgRating,
  })}
  else{
    await Tour.findByIdAndUpdate(userId,{
      ratingQuantity :  0,
      ratingsAverage : 4.5,
    })
  }
 // console.log(stats);
}
reviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.user);
})
reviewSchema.pre(/^findOneAnd/,async function(next){
   this.r = await this.findOne();
  //  console.log(this.r);
  next();
})
reviewSchema.post(/^findOneAnd/,async function(){
  await this.r.constructor.calcAverageRating(this.r.tour);
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
