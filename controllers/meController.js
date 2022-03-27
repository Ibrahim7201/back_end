const User = require('../models/userModel');
const Vendor = require('../models/vendorModel');
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
    const { name, photo, address, phone } = req.body;
    let updatedPerson;
    if (req.user.role === 'admin' || req.user.role === 'user') {
      updatedPerson = await User.findByIdAndUpdate(req.user._id, {
        name,
        photo,
        address,
        phone,
      });
    } else if (req.user.role === 'vendor') {
      updatedPerson = await Vendor.findByIdAndUpdate(req.user._id, {
        name,
        photo,
        address,
        phone,
      });
    }
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Your data is updated',
        updatedUser: updatedPerson,
      },
    });
  } catch (err) {
    next(new AppError(`Error in updating your data`, 422));
  }
};
