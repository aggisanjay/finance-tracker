const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction.model');
const authMiddleware = require('../middleware/auth');



router.get('/expenses', authMiddleware, async (req, res) => {
  try {
    const expenses = await Transaction.find({ type: 'expense', user: req.user._id });
    
    // If no expenses found, respond accordingly
    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: 'No expenses found' });
    }

    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

    res.status(200).json({
      expenses,
      totalExpenses,
    });
  } catch (error) {
    // Log the error to help with debugging
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      message: 'Error fetching expenses',
      error: error.message, // Provide more detailed error info
    });
  }
});




module.exports = router;

  

