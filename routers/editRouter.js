const express = require('express');
const editRouter = express.Router();
const authController = require('../controllers/authController');
const editController = require('../controllers/editController');
const vendorController = require('../controllers/vendorController');
editRouter
  .route('/')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    editController.editProduct
  )
  .get(authController.protect, vendorController.getAllVendors);

module.exports = editRouter;
