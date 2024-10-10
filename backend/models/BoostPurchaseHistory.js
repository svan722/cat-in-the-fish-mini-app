const mongoose = require('mongoose');

const BoostPurchaseHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    boostItem: { type: mongoose.Schema.Types.ObjectId, ref: 'BoostItem', required: true },
    purchaseDate: { type: Date, default: Date.now },
    quantity: { type: Number, default: 1 }, // Number of boosts purchased
});

module.exports = mongoose.model('BoostPurchaseHistory', BoostPurchaseHistorySchema);