const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    description: { type: String},

}, { collection: "products", timestamps: true ,toJSON:{virtuals:true}});

productSchema.virtual('price_vat').get(function () {
    return (
        (this.price * 0.07) + this.price
    )
})
const product = mongoose.model("Product", productSchema);

module.exports = product;