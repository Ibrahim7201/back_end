const express = require('express');
const vendorRouter = express.Router();
const vendorController = require('../controllers/vendorController');
const authController = require('../controllers/authController');

vendorRouter
  .route('/:id?')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    vendorController.getAllVendors
  )
  .put(
    authController.protect,
    authController.restrictTo('admin'),
    vendorController.getCertainVendor
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    vendorController.toggleBanVendor
  )
  .patch(authController.protect, vendorController.viewBannedVendors)
  .post(authController.protect, vendorController.queryVendorsByMail);
module.exports = vendorRouter;
