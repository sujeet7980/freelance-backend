const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');
const validator = require('validator');
const { defaultConfiguration } = require('../app');
// const User =require('./userModel')
const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  client_id: {
    type:  mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true
  },
  freelancer_id: {
    type:  mongoose.Schema.ObjectId,
    ref: 'Freelancer'
  },
  budget: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  skills:{
    type:[],
    default:[]
  },
  status: {
    type: String,
    enum: ['open', 'in progress', 'completed', 'cancelled'],
    default: 'open'
  },
  created_at: {
    type: Date,
    default: Date.now(),
    select: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}
);

// ProjectSchema.index({price:1 ,ratingsAverage:-1});
// ProjectSchema.index({slug:1});
// ProjectSchema.index({startLocation: '2dsphere'});

// ProjectSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7;
// });

ProjectSchema.virtual('reviews',{
      ref : 'Review',
      foreignField :'tour',
      localField: '_id'
})
// document middleware : run before .save() and .create()
// ProjectSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// ProjectSchema.pre(/^find/,function (next){
//   this.populate({
//     path :'guides',
//     select : '-__v -passwordChangedAt'
//   });
//   next();
// })

// ProjectSchema.pre('save',async function(next){
//   console.log(this.guides);
//   const guidePromise = this.guides.map( async id=> await User.findById(id));
//   this.guides =  await Promise.all(guidePromise);
//   next();
//   })
// ProjectSchema.pre('save', function (next) {
//   console.log('will save documents....');
//   next();
// });
// ProjectSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });
// ProjectSchema.post('/^find /', function (doc, next) {
//   console.log(doc);
//   next();
// });
// ProjectSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });
const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;
