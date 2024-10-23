const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String,required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
});

module.exports = mongoose.model('Transaction', transactionSchema);
