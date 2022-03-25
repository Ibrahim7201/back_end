const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getMyData = async (req, res, next) => {
  try {
    const me = await User.findById(req.user._id);
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Your data is Here',
        me,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting your data`, 422));
  }
};
