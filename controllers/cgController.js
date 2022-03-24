const Category = require('../models/categoriesModel');
const SubCategory = require('../models/subCategoriesModel');
const AppError = require('../utils/appError');
exports.addCategory = async (req, res, next) => {
  try {
    const { name, photo } = req.body;
    const category = await Category.create({
      name,
      photo,
    });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Category Added',
        category,
      },
    });
  } catch (err) {
    next(new AppError(`Error in adding Category!`, 404));
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const { name } = req.params;
    const cg = await Category.findOne({ name }).populate('subCategories', {
      name: 1,
    });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Category is Here!',
        category: cg,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting Category!`, 422));
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Categories are Here!',
        categories,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting categories`, 422));
  }
};

exports.editCategory = async (req, res, next) => {
  try {
    const { name } = req.params;
    const { newName, photo } = req.body;
    const cat = await Category.findOneAndUpdate(
      { name },
      { name: newName, photo }
    );
    if (!cat) return next(new AppError(`There is no such category`, 422));
    const newCategory = await Category.findOne({ name: newName });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Category Edited',
        newCategory,
      },
    });
  } catch (err) {
    next(new AppError(`Error in editing category`, 422));
  }
};

