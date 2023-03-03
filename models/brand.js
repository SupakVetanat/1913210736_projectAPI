const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
  name: { type: String, required: true, trim: true }, // String is shorthand for {type: String}
  location: {
    lat: Number,
    lgn: Number
  },
}, { collection: "brands", timestamps: true, toJSON: { virtuals: true } });
brandSchema.virtual('products', {
  ref: 'product', // Model
  localField: '_id', // author id
  foreignField: 'brand', // author in book
});

const brand = mongoose.model("Brand", brandSchema);

module.exports = brand;