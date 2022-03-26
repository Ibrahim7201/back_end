const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });
const vendorSchemaOptions = {
  toJSON: {
    virtuals: true,
  },
};
const vendorSchema = new mongoose.Schema(
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
      enum: ['vendor'],
      default: 'vendor',
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
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product',
    },
    orders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Order',
    },
    registerDate: {
      type: Date,
      default: Date.now(),
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  vendorSchemaOptions
);

vendorSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
vendorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, +process.env.SALT_ROUNDS);
  this.passwordConfirmation = undefined;
  next();
});

vendorSchema.methods.correctPassword = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

vendorSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

vendorSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
