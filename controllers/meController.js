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

exports.editMe = async (req, res, next) => {
  try {
    const { name, photo, address, phones } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
      name,
      photo,
      address,
      phones,
    });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Your data is updated',
        updatedUser,
      },
    });
  } catch (err) {
    next(new AppError(`Error in updating your data`, 422));
  }
};
