const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
  {
    shippingAddress: {
      city: { type: String },
      street: { type: String },
      suite: { type: String },
    },
    paymentMethod: {
      type: String,
      enum: ['cashondelivery', 'paypal'],
      default: 'cashondelivery',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderItems: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'OrderItem',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    status: {
      isOnWay: { type: Boolean, default: false },
      isPaid: { type: Boolean, default: false },
      isDelivered: { type: Boolean, default: false },
      isCancelled: { type: Boolean, default: false },
      isCompleted: { type: Boolean, default: false },
    },
    billRaw: { type: [Number], default: [0] },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

orderSchema.virtual('bill').get(function () {
  return this.billRaw.reduce((acc, cur) => acc + cur);
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
