const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Users are here',
        users,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting users`, 422));
  }
};

exports.getCertainUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .populate('orders')
      .populate({
        path: 'orders',
        populate: {
          path: 'products',
          model: 'Product',
        },
      });
    if (!user) return next(new AppError(`User doesn't exist`, 422));
    res.status(201).json({
      status: 'success',
      data: {
        status: 'User is here',
        user,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting user`, 422));
  }
};

exports.toggleBanUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    await User.findByIdAndUpdate(id, {
      isBanned: !user.isBanned,
    });
    const newUser = await User.findById(id);
    res.status(201).json({
      status: 'success',
      data: {
        status: newUser.isBanned ? 'User Banned' : 'User Unbanned',
        user: newUser,
      },
    });
  } catch (err) {
    next(new AppError(`Error in banning`, 422));
  }
};

exports.queryUsersByMail = async (req, res, next) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user || user.role === 'admin')
      return next(new AppError(`User Not Found`, 422));
    res.status(201).json({
      status: 'success',
      data: { status: 'User found', user },
    });
  } catch (err) {
    next(new AppError(`Error in finding User`, 422));
  }
};

exports.viewBannedUsers = async (req, res, next) => {
  try {
    const banned = await User.find({ isBanned: true })
      .where('role')
      .equals('user');
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Users banned are here',
        banned,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting banned Users`, 422));
  }
};
