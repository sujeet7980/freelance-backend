const express = require('express');
const router = express.Router();
const reviewRouter = require('./reviewRoutes');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/autoController');



router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.get('/me',userController.getMe,userController.getUser);
router.patch('/updatePassword',authController.updatePassword);
router.patch('/updateMe', userController.updateMyData);
router.delete('/deleteMe',userController.deleteMe);

router.use(authController.restrictTo('admin','client'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
