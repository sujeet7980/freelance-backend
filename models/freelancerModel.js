const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const freelancerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
  },
  title: {
    type: String,
    required : true
  },
  description: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true
  },
  portfolio: {
    type: [
      {
        title: String,
        description: String,
        url: String,
      },
    ],
    default: [],
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
    availability: {
        type :String,
        enum : ["available","unavailable","booked"],
        default: 'available'
    },
    ratings: {
      type: Number,
      default: 0
    },
    profile:{
      firstName: String,
      lastName:  String,
      location:String,
      profilePic:String,
    },
    created_at:{
      type :Date,
      default : Date.now(),
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must below 5.0'],
        set: val => Math.round(10*val)/10,
      },
      ratingQuantity: {
        type: Number,
        default: 0,
      },
});

const freelancer = mongoose.model('freelancer', freelancerSchema);

module.exports = freelancer;
