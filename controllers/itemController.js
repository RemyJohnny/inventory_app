const Item = require("../models/item");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

exports.index = asyncHandler(async (req, res, next) => {
  const [itemsCount, categoriesCount] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "inventory Application",
    itemsCount: itemsCount,
    categoriesCount: categoriesCount,
  });
});

exports.item_list = asyncHandler(async (req, res, next) => {
  const allItem = await Item.find({}).sort({ num_in_stock: 1 }).exec();
  res.render("item_list", { title: "ITEM LIST", item_list: allItem });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();
  res.render("item_detail", { title: "ITEM DETAIL", item: item });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).sort({ name: 1 }).exec();
  res.render("item_form", {
    title: "Create new Item",
    categories: categories,
    countries: Countries,
  });
});

exports.item_create_post = [
  body("name", "Name field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("country", "country field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("alc_vol", "alc % field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("desc", "Description field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("fact").optional().trim().escape(),
  body("num_in_stock").optional().trim().escape(),
  body("price", "price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("category", "category field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      desc: req.body.desc,
      category: req.body.category,
      country: req.body.country,
      alc_vol: req.body.alc_vol,
      fact: req.body.fact,
      price: req.body.price,
      num_in_stock: req.body.num_in_stock,
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find({}).sort({ name: 1 }).exec();
      res.render("item_form", {
        title: "Create New Item",
        categories: categories,
        errors: errors.array(),
        item: item,
        countries: Countries,
      });
      return;
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  if (item === null) {
    res.redirect("/catalog/items");
  }

  res.render("item_delete", { title: "Delete Item", item: item });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.body.itemId).exec();
  res.redirect("/catalog/items");
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Category.find({}).sort({ name: 1 }).exec(),
  ]);
  if (item === null) {
    const err = new Error("item not found");
    err.status = 404;
    return next(err);
  }
  res.render("item_form", {
    title: "Update Item",
    categories: categories,
    item: item,
    countries: Countries,
  });
});

exports.item_update_post = [
  body("name", "Name field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("desc", "Description field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("fact").optional().trim().escape(),
  body("num_in_stock").optional().trim().escape(),
  body("price", "price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("category", "category field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const update = new Item({
      name: req.body.name,
      desc: req.body.desc,
      category: req.body.category,
      country: req.body.country,
      alc_vol: req.body.alc_vol,
      fact: req.body.fact,
      price: req.body.price,
      num_in_stock: req.body.num_in_stock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find({}).sort({ name: 1 }).exec();
      res.render("item_form", {
        title: "Update Item",
        categories: categories,
        errors: errors.array(),
        item: update,
        countries: Countries,
      });
      return;
    } else {
      const updated = await Item.findByIdAndUpdate(req.params.id, update, {});
      res.redirect(updated.url);
    }
  }),
];
