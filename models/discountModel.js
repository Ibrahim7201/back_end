const mongoose = require('mongoose');
const discountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Add discount Name`],
  },
  percentage: {
    type: Number,
    required: [true, `Percentage must be added`],
  },
  endDate: {
    type: String,
    required: [true, `End date must be added`],
  },
});

discountSchema.pre('save', function (next) {
  let value;
  switch (true) {
    case /d/i.test(this.endDate):
      value = +this.endDate.split('d')[0];
      this.endDate = Date.now() + value * 24 * 60 * 60 * 1000;
      break;
    case /m/i.test(this.endDate):
      value = +this.endDate.split('m')[0];
      this.endDate = Date.now() + value * 30 * 24 * 60 * 60 * 1000;
      break;
    case /w/i.test(this.endDate):
      value = +this.endDate.split('w')[0];
      this.endDate = Date.now() + value * 7 * 24 * 60 * 60 * 1000;
      break;
    default:
      break;
  }
  next();
});

const Discount = mongoose.model('Discount', discountSchema);
module.exports = Discount;
