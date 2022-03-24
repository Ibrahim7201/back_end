const express = require('express');
const cgRouter = express.Router();
const cgController = require('../controllers/cgController');
const authController = require('../controllers/authController');

cgRouter
  .route('/:name?')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    cgController.addCategory
  )
  .get(cgController.getCategory)
  .put(cgController.getAllCategories)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    cgController.editCategory
  );
module.exports = cgRouter;
