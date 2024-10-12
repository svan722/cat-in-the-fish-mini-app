const mongoose = require('mongoose');

const PayHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    purchaseDate: { type: Date, default: Date.now },
    quantity: { type: Number, default: 1 }, // Number of boosts purchased
});

module.exports = mongoose.model('PayHistory', PayHistorySchema);