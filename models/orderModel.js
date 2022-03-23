const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
  {
    shippingAddress: {
      city: { type: String },
      street: { type: String },
      suite: { type: String },
    },
    userId: { type: mongoose.Schema.Types.ObjectId },
    vendorId: { type: mongoose.Schema.Types.ObjectId },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    products: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    status: {
      isOnWay: { type: Boolean, default: true },
      isPaid: { type: Boolean, default: false },
      isCashOnDelivery: { type: Boolean, default: false },
      isDelivered: { type: Boolean, default: false },
      isCancelled: { type: Boolean, default: false },
      isRetrieved: { type: Boolean, default: false },
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
