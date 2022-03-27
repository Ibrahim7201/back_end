const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');
const vendorController = require('../controllers/vendorController');
const authController = require('../controllers/authController');
adminRouter
  .route('/')
  .patch(authController.protect, vendorController.viewBannedVendors)
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    vendorController.getAllVendors
  )
  .post(authController.protect, adminController.acceptOrder)
  .put(authController.protect, adminController.getAllPendingOrders)
  .options(authController.protect, vendorController.viewBannedVendors);

module.exports = adminRouter;
