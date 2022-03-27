const crypto = require('crypto');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });
const { promisify } = require('util');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const Vendor = require('../models/vendorModel');
const signToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id, user.role === 'admin' ? true : false);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOption.secure = true;
  }
  res.cookie('jwt', token, cookieOption);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return next(`User is not logged in please login first`);
    }
    const payLoad = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const freshUser = await User.findById(payLoad.id);
    const freshVendor = await Vendor.findById(payLoad.id);
    if (!freshUser && !freshVendor) {
      return next('User belongs to this token no longer exists');
    }
    if (
      freshUser.changedPasswordAfter(payLoad.iat) ||
      freshVendor.changedPasswordAfter(payLoad.iat)
    ) {
      return next(`User changed password after the token was issued`);
    }
    if (freshUser) req.user = freshUser;
    if (freshVendor) req.user = freshVendor;
    next();
  } catch (err) {
    next(new AppError(`Error in Authentication`, 404));
  }
};

exports.signup = async (req, res, next) => {
  try {
    const {
      name,
      password,
      email,
      passwordConfirmation,
      passwordChangedAt,
      role,
      phones,
    } = req.body;
    let toBeSend;
    const cart = await Cart.create({});
    if (role === 'vendor') {
      const vendor = await Vendor.find({ email });
      if (vendor[0]) next(new AppError('Vendor Exists', 422));
      const cart = await Cart.create({});
      toBeSend = await Vendor.create({
        name,
        password,
        email,
        passwordConfirmation,
        passwordChangedAt,
        role,
        phones,
        cartId: cart._id,
      });
    } else if (role === 'user') {
      const user = await User.find({ email });
      if (user[0]) next(new AppError('User Exists', 422));
      toBeSend = await User.create({
        name,
        password,
        email,
        passwordConfirmation,
        passwordChangedAt,
        role,
        phones,
        cartId: cart._id,
      });
    }
    await Cart.findOneAndUpdate({ _id: cart._id }, { userId: toBeSend._id });
    await res.cookie('name', toBeSend.name.toString(), {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
    });
    sendToken(toBeSend, 201, res);
  } catch (err) {
    next(new AppError(`Error in Signing Up`, 404));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({
        status: 'fail',
        message: 'Invalid Inputs!',
      });
    }
    const user = await User.findOne({ email }).select('+password');
    const vendor = await Vendor.findOne({ email }).select('+password');
    if (!user && !vendor) return next(new AppError(`User not found`, 422));
    if (user) {
      if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect Password or email', 400));
      }
      if (user.isBanned) return next(new AppError(`You are Banned`, 422));
      const userName = user.name.toString();
      res.cookie('name', userName, {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
      });
      await User.findOneAndUpdate({ _id: user._id }, { isActive: true });
      sendToken(user, 201, res);
    }
    if (vendor) {
      if (
        !vendor ||
        !(await vendor.correctPassword(password, vendor.password))
      ) {
        return next(new AppError('Incorrect Password or email', 400));
      }
      if (vendor.isBanned) return next(new AppError(`You are Banned`, 422));
      const userName = vendor.name.toString();
      res.cookie('name', userName, {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
      });
      await Vendor.findOneAndUpdate({ _id: vendor._id }, { isActive: true });
      sendToken(vendor, 201, res);
    }
  } catch (err) {
    next(new AppError('Error in Loging in', 404));
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie('jwt', '', {
      expires: new Date(Date.now() - 1000000),
      httpOnly: true,
    });
    res.cookie('name', 'Logged-out', {
      expires: new Date(Date.now() - 1000000),
    });
    if (req.user.role === 'vendor') {
      await Vendor.findOneAndUpdate({ _id: req.user._id }, { isActive: false });
    } else if (req.user.role === 'user') {
      await User.findOneAndUpdate({ _id: req.user._id }, { isActive: false });
    }
    res.json('You are logged out');
  } catch (err) {
    next(new AppError(`Can't LogOut`, 505));
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to access this acction", 402)
      );
    }
    next();
  };
};

exports.forgetPassword = async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new AppError(`There is no user with this email address`, 422));
  }
  const resetToken = await user.createPasswordResetToken();
  await user.save({
    validateBeforeSave: false,
  });
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/reset-password/${resetToken}. \nIf you didin't forget your password
        please ignore this email`;
  const message = `Forgot your password? Submit a PATCH 
       request with your new password and passwordConfirmation to: ${resetURL}`;
  try {
    await sendEmail({
      email: req.body.email,
      subject: `Your password reset token (valid for 10 min)`,
      message,
    });
    res.status(201).json({
      status: 'Success',
      message: `Token sent to email! ✔`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Try again later.',
        500
      )
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    let token;
    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });
      if (!vendor) return next(new AppError(`Token has expired!`, 400));
      vendor.password = req.body.password;
      vendor.passwordConfirmation = req.body.passwordConfirmation;
      vendor.passwordResetExpires = undefined;
      vendor.passwordResetToken = undefined;
      await vendor.save();
      token = signToken(vendor._id);
    } else if (req.user.role === 'user') {
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });
      if (!user) return next(new AppError(`Token has expired!`, 400));
      user.password = req.body.password;
      user.passwordConfirmation = req.body.passwordConfirmation;
      user.passwordResetExpires = undefined;
      user.passwordResetToken = undefined;
      await user.save();
      token = signToken(user._id);
    }
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    next(new AppError('Failed to reset password', 422));
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { password, passwordConfirmation } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const vendor = await Vendor.findById(req.user._id).select('+password');
    if (vendor) {
      if (
        !(await vendor.correctPassword(
          req.body.currentPassword,
          vendor.password
        ))
      ) {
        return next(new AppError(`Your current password is wrong!`, 401));
      }
      if (password !== passwordConfirmation)
        return next(new AppError(`Passwords don't match`, 422));
      await Vendor.findOneAndUpdate(
        { _id: req.user._id },
        { password, passwordConfirmation }
      );
      sendToken(vendor, 200, res);
    } else if (user) {
      if (
        !(await user.correctPassword(req.body.currentPassword, user.password))
      ) {
        return next(new AppError(`Your current password is wrong!`, 401));
      }
      if (password !== passwordConfirmation)
        return next(new AppError(`Passwords don't match`, 422));
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { password, passwordConfirmation }
      );
      sendToken(user, 200, res);
    }
  } catch (err) {
    console.log(err);
    next(new AppError(`Error in updating password`, 422));
  }
};
