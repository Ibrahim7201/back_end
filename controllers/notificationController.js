const Notification = require('../models/notificationModel');
const AppError = require('../utils/appError');

exports.getMine = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id });
    res.status(200).json({
      status: 'success',
      data: {
        notifications,
      },
    });
  } catch (err) {
    next(new AppError('Error in getting notifications', 422));
  }
};

exports.makeSeen = async (req, res, next) => {
  try {
    const notification = await Notification.find({ userId: req.user._id });
    notification.seen = true;
    await notification.save();
    res.status(200).json({
      status: 'success',
      data: {
        notification,
      },
    });
  } catch (err) {
    next(new AppError('Error in making notification seen', 422));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const notification = await Notification.findOneAndRemove({ _id });
    res.status(200).json({
      status: 'success',
      data: {
        notification,
      },
    });
  } catch (err) {
    next(new AppError('Error in deleting notification', 422));
  }
};
