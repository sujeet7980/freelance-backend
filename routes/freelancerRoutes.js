const express = require('express');
const router = express.Router();
const reviewRouter = require('./reviewRoutes');
const freelanceController = require('./../controllers/freelancerController');
const authController = require('./../controllers/autoController');

router.use('/:freelanceId/review', reviewRouter);

router.use(authController.protect);
router.use(authController.restrictTo('admin','client'));
router
  .route('/')
  .get(freelanceController.getAllfreelancers)
  .post(freelanceController.createfreelancer);
router
  .route('/:id')
  .get(freelanceController.getfreelancer)
  .patch(freelanceController.updatefreelancer)
  .delete(freelanceController.deletefreelancer);

module.exports = router;