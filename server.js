const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const port = process.env.PORT || 3000;
const authRouter = require('./routers/authRouter');
const cgRouter = require('./routers/cgRouter');
const scgRouter = require('./routers/scgRouter');
const productRouter = require('./routers/productRouter');
const discRouter = require('./routers/discRouter');
const revRouter = require('./routers/reviewRouter');
const cartRouter = require('./routers/cartRouter');
const variantRouter = require('./routers/variantRouter');
const orderRouter = require('./routers/orderRouter');
const globalError = require('./controllers/errorContoller');
dotenv.config({ path: './config.env' });

main();
async function main() {
  try {
    mongoose.connect(process.env.DATABASE_LOCAL);
  } catch (err) {
    console.log(err.message);
  }
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: `Too many requests from this IP, please try again in an hour`,
});
app.use(express.json());
app.use('/', limiter);
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded());
app.use(helmet());
app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}
app.use('/auth', authRouter);
app.use('/category', cgRouter);
app.use('/subcategory', scgRouter);
app.use('/product', productRouter);
app.use('/discount', discRouter);
app.use('/review', revRouter);
app.use('/cart', cartRouter);
app.use('/variant', variantRouter);
app.use('/order', orderRouter);

app.use(globalError);
app.listen(port, () => {
  console.log(`App listens on ${port}`);
});
