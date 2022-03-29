const express = require('express');
const scgRouter = express.Router();
const scgController = require('../controllers/scgController');
const authController = require('../controllers/authController');
scgRouter
  .route('/:name?')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    scgController.addSubCategory
  )
  .get(authController.protect, scgController.getProductsBySubCategory)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    scgController.editSubCategory
  );

module.exports = scgRouter;
