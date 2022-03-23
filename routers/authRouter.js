const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');

authRouter
  .route('/')
  .put(authController.login)
  .post(authController.signup)
  .delete(authController.logout)
  .get(authController.forgetPassword)
  .patch(authController.protect, authController.updatePassword);

authRouter.patch('/reset-password/:token', authController.resetPassword);

module.exports = authRouter;
