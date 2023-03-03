const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: String},
    color:{ type: String},

}, { collection: "Orders", timestamps: true ,toJSON:{virtuals:true}});


const order = mongoose.model("order", orderSchema);

module.exports = order;