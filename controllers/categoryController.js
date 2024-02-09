const Item = require("../models/item");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategory = await Category.find({}).sort({ name: 1 }).exec();
  res.render("category_list", {
    title: "CATEGORY LIST",
    category_list: allCategory,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, allItem] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).sort({ num_in_stock: 1 }).exec(),
  ]);
  if (category === null) {
    res.redirect("/catalog/categories");
    return;
  }

  res.render("category_detail", {
    title: "Category detail",
    category: category,
    item_list: allItem,
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create  New Category" });
});

exports.category_create_post = [
  body("name", "category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("desc", "a description is required")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      desc: req.body.desc,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create  New Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const exists = await Category.findOne({ name: req.body.name }).exec();
      if (exists) {
        res.redirect(exists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, allItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).sort({ name: 1 }).exec(),
  ]);

  if (category === null) {
    res.redirect("/catalog/categories");
    return;
  }
  res.render("category_delete", {
    title: "Delete category",
    category: category,
    item_list: allItems,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, allItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).sort({ name: 1 }).exec(),
  ]);

  if (allItems.length > 0) {
    res.render("category_delete", {
      title: "Delete category",
      category: category,
      item_list: allItems,
    });
    return;
  } else {
    await Category.findByIdAndDelete(req.body.categoryId).exec();
    res.redirect("/catalog/categories");
  }
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  if (category === null) {
    const err = new Error("category not found");
    err.status = 404;
    return next(err);
  }
  res.render("category_form", { title: "Update category", category: category });
});

exports.category_update_post = [
  body("name", "category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("desc", "a description is required")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const update = new Category({
      name: req.body.name,
      desc: req.body.desc,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update category",
        category: update,
        errors: errors.array(),
      });
      return;
    } else {
      const updated = await Category.findByIdAndUpdate(
        req.params.id,
        update,
        {}
      );
      res.redirect(updated.url);
    }
  }),
];
