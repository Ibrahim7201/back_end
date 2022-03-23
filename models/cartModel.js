const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, `Please login first`],
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity can not be less then 1.'],
        default: 1,
      },
      price: Number,
    },
  ],
});

cartSchema.virtual('bill').get(function () {
  let prices = [];
  this.items.forEach(el => prices.push(el.price));
  return prices.reduce((acc, cur) => acc + cur);
});
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
