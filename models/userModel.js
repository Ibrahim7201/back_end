const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const joi = require('joi');
dotenv.config({ path: '../config.env' });
const userSchemaOptions = {
  toJSON: {
    virtuals: true,
  },
};
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minLength: 8,
      select: false,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Mail is required'],
    },
    passwordConfirmation: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    phones: [
      {
        area: {
          type: String,
        },
        prefix: {
          type: String,
        },
        line: {
          type: String,
        },
      },
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    role: {
      type: String,
      enum: ['user', 'vendor'],
      default: 'user',
    },
    photo: {
      type: String,
    },
    address: {
      city: { type: String },
      street: { type: String },
      suite: { type: String },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    orders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Order',
    },
    registerDate: {
      type: Date,
      default: Date.now(),
    },
  },
  userSchemaOptions
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, +process.env.SALT_ROUNDS);
  this.passwordConfirmation = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
