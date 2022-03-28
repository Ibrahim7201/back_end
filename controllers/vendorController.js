const Vendor = require('../models/vendorModel');
const Order = require('../models/orderModel');
const AppError = require('../utils/appError');
exports.getAllVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find({})
      .populate('products')
      .populate('orders');
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
    const vendor = await Vendor.findById(id)
      .populate({
        path: 'orders',
        populate: {
          path: 'productId',
          model: 'Product',
        },
      })
      .populate('products');
    if (!vendor) return next(new AppError(`Vendor doesn't exist`, 422));
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Vendor is here',
        vendor,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting user`, 422));
  }
};
exports.toggleBanVendor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);
    await Vendor.findByIdAndUpdate(id, {
      isBanned: !vendor.isBanned,
    });
    const newVendor = await Vendor.findById(id);
    res.status(201).json({
      status: 'success',
      data: {
        status: newVendor.isBanned ? 'Vendor Banned' : 'Vendor Unbanned',
        vendor: newVendor,
      },
    });
  } catch (err) {
    next(new AppError(`Error in banning`, 422));
  }
};
exports.viewBannedVendors = async (req, res, next) => {
  try {
    const banned = await Vendor.find({ isBanned: true });

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
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return next(new AppError(`Vendor Not Found`, 422));
    res.status(201).json({
      status: 'success',
      data: { status: 'Vendor found', vendor },
    });
  } catch (err) {
    next(new AppError(`Error in finding Vendor`, 422));
  }
};
exports.acceptOrder = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const order = await Order.findById(_id);
    if (!order) return next(new AppError(`Order doesn't exist`, 422));
    if (order.status.isOnWay !== true)
      return next(new AppError(`Order already On way`, 422));
    await Order.findByIdAndUpdate(id, {
      $set: { 'status.isOnWay': true },
    });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Order Accepted',
        order,
      },
    });
  } catch (err) {
    next(new AppError(`Error in accepting Order`, 422));
  }
};

exports.viewPendingOrders = async (req, res, next) => {
  try {
    const pending = await Order.find({
      vendorId: req.user._id,
      'status.isOnWay': false,
    });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Pending Orders are here',
        pending,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting pending Orders`, 422));
  }
};
