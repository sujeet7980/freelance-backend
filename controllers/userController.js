const express = require('express');
const User = require('../models/userModel.js');
const AppError = require('../utils/appError.js');
const Factory = require('../controllers/handlerFactory')
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const filterObj =(Obj, ...allowedfield)=>{
  const newObj= {};
  Object.keys(Obj).forEach(el=>{
     if(allowedfield.includes(el)) newObj[el]=Obj[el];
  })
  return newObj;
}

exports.updateMyData = catchAsync(async(req,res,next)=>{
    // create error if user post password data
    if(req.body.password || req.body.passwordConfirm){
       return next(
        new AppError('this route is not for password Update ....',400)
       )
    }

    // filter object details 
    const filterBody = filterObj(req.body,"name","email");
    console.log(filterBody);
    // update users data 
    const updatedUser= await  User.findByIdAndUpdate(req.user.id,filterBody,{new:true , runValidators: true})
    res.status(200).json({
      status: 'success',
      data:{
        user: updatedUser,
      }
     })
  
});

exports.deleteMe = catchAsync(async (req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active: false});

    res.status(204).json({
      status: 'success',
      data:null
     })
  
})
exports.getMe = (req,res,next)=>{
  req.params.id=req.user.id;
  next();
}
exports.getUser = Factory.getOne(User);
exports.deleteUser = Factory.deleteOne(User);
exports.createUser = Factory.createOne(User);
exports.updateUser = Factory.updateOne(User);
exports.getAllUsers = Factory.getAll(User);