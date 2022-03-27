const Product = require('../models/productsModel');
const Category = require('../models/categoriesModel');
const SubCategory = require('../models/subCategoriesModel');
const Discount = require('../models/discountModel');
const Vendor = require('../models/vendorModel');
const Notification = require('../models/notificationModel');
const AppError = require('../utils/appError');

exports.addProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      photo,
      price,
      category,
      subCategory,
      stock,
      specs,
    } = req.body;
    const cat = await Category.findOne({ name: category });
    const subcat = await SubCategory.findOne({ name: subCategory });
    let vendorName;
    let isAccepted;
    if (req.user.role === 'vendor') {
      vendorName = req.user.name;
      isAccepted = false;
    } else {
      vendorName = 'JUMIA';
      isAccepted = true;
    }
    const product = await Product.create({
      name,
      photo,
      description,
      price,
      stock,
      specs,
      category: cat._id,
      subCategory: subcat._id,
      vendorName,
      vendorId: req.user._id,
      isAccepted,
    });
    if (req.user.role === 'vendor')
      await Vendor.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { products: product._id } }
      );
    let { products } = subcat;
    products.push(product._id);
    await SubCategory.findOneAndUpdate({ name: subCategory }, { products });
    const admin = await User.findOne({ role: 'admin' });
    const notification = await Notification.create({
      userId: admin._id,
      content: `${product.name} has been added by ${req.user.name}`,
    });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Product Added',
        product,
      },
    });
  } catch (err) {
    next(new AppError(`Error in adding Product`, 422));
  }
};

exports.getProductByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const { discount, _id } = await Product.findOne({ name });
    const discountApplied = await Discount.findOne({
      _id: discount._id,
    });
    if (!discountApplied) {
      await Product.findOneAndUpdate(
        { _id },
        { discount: '62390e4391a93ebde0ec2c0f' }
      );
    }
    const value = discountApplied.endDate;
    if (+value < Date.now()) {
      await Discount.findOneAndRemove({ _id: discountApplied._id });
      await Product.findOneAndUpdate(
        { _id },
        { discount: '62390e4391a93ebde0ec2c0f' }
      );
    }

    const product = await Product.findOne({ name })
      .populate('category', { name: 1 })
      .populate('subCategory', { name: 1 })
      .populate('discount')
      .populate('reviews');

    res.status(201).json({
      status: 'success',
      data: {
        status: 'Product is Here',
        product,
      },
    });
  } catch (err) {
    next(new AppError(`Error in Finding Product By Name`, 422));
  }
};

exports.addInStock = async (req, res, next) => {
  try {
    const { name, addInStock } = req.body;
    let { stock } = await Product.findOne({ name });
    stock += addInStock;
    await Product.findOneAndUpdate({ name }, { stock });
    const product = await Product.findOne({ name });

    res.status(201).json({
      status: 'success',
      data: {
        status: `Added ${addInStock} to stock`,
        existingInStock: product.stock,
      },
    });
  } catch (err) {
    next(new AppError(`Error in adding product to stock`, 422));
  }
};

exports.removeProductsFromStock = async (req, res, next) => {
  try {
    const { name, removeFromStock } = req.body;
    let { stock } = await Product.findOne({ name });
    stock -= removeFromStock;
    if (+stock < 0) {
      let rem = 0 - +stock;
      stock = 0;
      return next(new AppError(`Stocks lacks ${rem}`, 422));
    }
    await Product.findOneAndUpdate({ name }, { stock });
    const product = await Product.findOne({ name });
    res.status(201).json({
      status: 'success',
      data: {
        status: `Romoved ${removeFromStock} from stock`,
        existingInStock: product.stock,
      },
    });
  } catch (err) {
    next(new AppError(`Error in removing from stock`, 422));
  }
};

exports.acceptProduct = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id },
      { isAccepted: true }
    );
    if (!product) return next(new AppError(`Product doesn't exist`, 422));
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Product Accepted',
      },
    });
  } catch (err) {
    next(new AppError(`Error in Accepting Order`, 422));
  }
};
