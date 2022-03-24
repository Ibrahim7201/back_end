const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

userRouter
  .route('/:id?')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  )
  .put(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getCertainUser
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.toggleBanUser
  )
  .patch(authController.protect, userController.viewBannedUsers)
  .post(authController.protect, userController.queryUsersByMail);
module.exports = userRouter;
