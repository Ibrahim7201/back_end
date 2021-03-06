const mongoose = require('mongoose');
const Discount = require('./discountModel');
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: 'No Description Added yet',
    },
    photo: { type: String },
    dateAdded: {
      type: Date,
      default: Date.now(),
    },
    vendorName: {
      type: String,
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Discount',
      default: '62390e4391a93ebde0ec2c0f',
    },
    stock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    specs: [
      {
        name: {
          type: String,
        },
        value: {
          type: String,
        },
      },
    ],
    reviews: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Review',
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    orders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'OrderItem',
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);
productSchema.virtual('currentPrice').get(function () {
  if (this.discount.endDate) {
    return (+this.price * (100 - +this.discount.percentage)) / 100;
  } else {
    return this.price;
  }
});
productSchema.virtual('rating').get(function () {
  let arr = [];
  if (this?.reviews[0]?.rate) {
    this.reviews.forEach(rev => {
      arr.push(+rev.rate);
    });
    const total = arr.reduce((acc, cur) => {
      acc + cur;
    });
    return total / arr.length;
  } else {
    return 'Not Computed';
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
