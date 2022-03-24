const User = require('../models/userModel');

exports.getAllVendors = async (req, res, next) => {
  try {
    const vendors = await User.find({ role: 'vendor' });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Vendors are here',
        vendors,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting vendors`, 422));
  }
};
exports.getCertainVendor = async (req, res, next) => {
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
    if (!user) return next(new AppError(`Vendor doesn't exist`, 422));
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Vendor is here',
        user,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting user`, 422));
  }
};
exports.toggleBanVendor = async (req, res, next) => {
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
        status: newUser.isBanned ? 'Vendor Banned' : 'Vendor Unbanned',
        user: newUser,
      },
    });
  } catch (err) {
    next(new AppError(`Error in banning`, 422));
  }
};
exports.viewBannedVendors = async (req, res, next) => {
  try {
    const banned = await User.find({ isBanned: true })
      .where('role')
      .equals('vendor');
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Vendors banned are here',
        banned,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting banned Vendors`, 422));
  }
};
exports.queryVendorsByMail = async (req, res, next) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user || user.role === 'user' || user.role === 'admin')
      return next(new AppError(`Vendor Not Found`, 422));
    res.status(201).json({
      status: 'success',
      data: { status: 'Vendor found', user },
    });
  } catch (err) {
    next(new AppError(`Error in finding Vendor`, 422));
  }
};
