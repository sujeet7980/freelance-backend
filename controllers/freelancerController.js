const express = require('express');
const Freelancer = require('../models/freelancerModel.js');
const AppError = require('../utils/appError.js');
const Factory = require('../controllers/handlerFactory')
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.getfreelancer = Factory.getOne(Freelancer);
exports.deletefreelancer = Factory.deleteOne(Freelancer);
exports.createfreelancer = Factory.createOne(Freelancer);
exports.updatefreelancer = Factory.updateOne(Freelancer);
exports.getAllfreelancers = Factory.getAll(Freelancer);