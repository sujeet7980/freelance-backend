const express = require('express');

const projectController = require('../controllers/ProjectController');
const authController = require('../controllers/autoController');

const router = express.Router();


router
  .route('/')
  .get(projectController.getAllProjects)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'client'),
    projectController.createProject
  );

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'client'),
    projectController.updateProject
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'client'),
    projectController.deleteProject
  );

module.exports = router;
