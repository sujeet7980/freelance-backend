const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const currentPassword= require('../models/userModel');
const { log } = require('console');
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
exports.getAllUser = catchAsync(async (req, res) => {
  //execute theory
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
 const CreateAndSendToken= (user,statusCode,res)=>{
  const token = signToken(user._id);
  const cookieOption = {
    expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
    httpOnly:true
  };
  if(process.env.NODE_ENV==="production") cookieOption.secure = true;
  res.cookie("jwt",token,cookieOption)
  user.password= undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    },
  });
 }
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
   CreateAndSendToken(newUser,201,res);
  
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check is user or password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  //check if user exits and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //if everything all right
  CreateAndSendToken(user,201,res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) check if the token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  if (!decoded) {
    return next(new AppError('Invalid token,Please log in again!', 401));
  }
  // 3) check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  //4) check if user changed password after the token was issue
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('USer recently changed! Please log in again.', 401)
    );
  }
  // Grant access to protested route
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to change', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on the posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('no user found with this email id', 404));
  }
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}//${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? submit a patch request on the link ${resetURL} with your new password and passwordConfirm .\n If not forgot please ignore the mail.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token(valid for 10 min only)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'token sent to Email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });
  }
});
exports.resetPassword = async (req, res, next) => {
  console.log(req.params.token);
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  console.log(hashedToken);
  // get user based on the basis of token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  //if user is not expired then update password
  if (!user) {
    return next(new AppError('Invalid token or token expires', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  // if every thing okay send token to client
  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
  });
};

exports.updatePassword= async (req,res,next) =>{
   // 1) get user from collection
         const user = await User.findById(req.user.id).select('+password');
   // 2) check if Posted current password is correct 
          if (await ! user.correctPassword(req.body.passwordCurrent,user.password)){
             return next(new AppError("Your current password is wrong.",401));
          }
   // 3) If so, update password
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    await user.save();
   // 4) Log user in, sent JWT 
   CreateAndSendToken(user,201,res);
   
}