const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true, maxLength: 100 },
  desc: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  country: { type: String, required: true },
  alc_vol: { type: Number, required: true },
  fact: { type: String },
  price: { type: Number, required: true },
  num_in_stock: { type: Number, required: true, default: 1 },
});

ItemSchema.virtual("url").get(function () {
  return `/catalog/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
