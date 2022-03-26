const express = require('express');
const notificationRouter = express.Router();
const notificationController = require('../controllers/notificationController');
const authController = require('../controllers/authController');
notificationRouter
  .route('/')
  .get(authController.protect, notificationController.getMine)
  .post(authController.protect, notificationController.makeSeen)
  .delete(authController.protect, notificationController.delete);

module.exports = notificationRouter;
