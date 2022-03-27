const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  quantity: { type: Number, default: 1 }, // default 1
  price: { type: Number, default: 0 }, // default 0
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);
module.exports = OrderItem;
