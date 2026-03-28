const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  brand: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ["smartphone", "laptop", "headphones", "smartwatch"],
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  attributes: {
    type: Object,
    default: {}
  },

  woo_id: {
    type: String,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);