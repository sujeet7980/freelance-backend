const Project= require('../models/ProjectModel');
const AppError = require('../utils/appError');
const Factory =require('./handlerFactory')
const APIFeatures =require('../utils/apiFeatures')
const catchAsync = require("../utils/catchAsync")


exports.createProject=Factory.createOne(Project);
exports.updateProject= Factory.updateOne(Project);
exports.deleteProject= Factory.deleteOne(Project);
exports.getAllProjects = Factory.getAll(Project);
exports.getProject=Factory.getOne(Project,{path : 'reviews'});