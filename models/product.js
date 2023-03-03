const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    QTY: { type: Number },
    description: { type: String},

}, { collection: "products", timestamps: true ,toJSON:{virtuals:true}});
productSchema.virtual('Orders', {
    ref: 'order', 
    localField: '_id', 
    foreignField: 'product', 
  });
const product = mongoose.model("Product", productSchema);

module.exports = product;