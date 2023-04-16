const express = require('express');
const Review = require('../models/reviewModel');
const Factory = require('../controllers/handlerFactory');

// const filterObj =(Obj, ...allowedfield)=>{
//   const newObj= {};
//   Object.keys(Obj).forEach(el=>{
//      if(allowedfield.includes(el)) newObj[el]=Obj[el];
//   })
//   return newObj;
// }

  exports.setDetailId= (req,res,next)=>{
    // console.log(req.body);
    if(!req.body.user) req.body.user =req.params.userId;
    if(!req.body.client) req.body.client = req.user.id
    next();
  }
exports.createReview = Factory.createOne(Review);
exports.deleteReview = Factory.deleteOne(Review);
exports.updateReview = Factory.updateOne(Review);
exports.getAllReviews = Factory.getAll(Review);
exports.getReview = Factory.getOne(Review);

