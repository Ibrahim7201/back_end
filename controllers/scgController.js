const SubCategory = require('../models/subCategoriesModel');
const Category = require('../models/categoriesModel');
const Product = require('../models/productsModel');
const Discount = require('../models/discountModel');
const Variant = require('../models/variantModel');
const AppError = require('../utils/appError');

exports.addSubCategory = async (req, res, next) => {
  try {
    const { name, photo, category, variants } = req.body;
    const cg = await Category.findOne({ name: category });
    let scgArray = cg.subCategories;
    const scg = await SubCategory.create({ name, photo });
    scgArray.push(scg._id);
    await Category.findOneAndUpdate(
      { name: category },
      { subCategories: scgArray }
    );
    variants.forEach(async variant => {
      const v = await Variant.create({
        name: variant.name,
        options: variant.options,
      });

      await SubCategory.findOneAndUpdate(
        { _id: scg._id },
        { $push: { variants: v._id } }
      );
    });
    const scgFinal = await SubCategory.findOne({ _id: scg._id });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'success',
        subCategory: scgFinal,
      },
    });
  } catch (err) {
    next(new AppError(`Error in adding Sub-Category`, 422));
  }
};

exports.getProductsBySubCategory = async (req, res, next) => {
  try {
    const { name } = req.params;
    const { products } = await SubCategory.findOne({ name });
    products.forEach(async product => {
      console.log(product);
      const { discount, _id } = await Product.findOne({ _id: product });
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
    });
    const scg = await SubCategory.findOne({ name }).populate({
      path: 'products',
      populate: {
        path: 'discount',
        model: 'Discount',
      },
      populate: {
        path: 'reviews',
        model: 'Review',
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        status: 'All Products are here',
        products: scg.products,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting products by sub-category`, 422));
  }
};
