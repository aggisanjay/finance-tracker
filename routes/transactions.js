const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction.model');
const auth = require('../middleware/auth');

// POST /transactions - Add a new transaction
router.post('/', async (req, res) => {
  const { type, category, amount, description } = req.body;

  try {
    const newTransaction = new Transaction({
      type,
      category,
      amount,
      description,
     // user: req.user._id
      // If you're implementing user authentication, include user information
      // user: req.user._id // assuming user ID is stored in req.user
    });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: 'Error adding transaction', error });
  }
});

// GET /transactions - Fetch all transactions with pagination
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Set default values for page and limit

  try {
    const transactions = await Transaction.find()
      .populate('category') // Populates category name if needed
      .skip((page - 1) * limit) // Skip records based on the current page
      .limit(Number(limit)); // Limit the number of records returned

    const totalTransactions = await Transaction.countDocuments(); // Total transactions count

    res.status(200).json({
      totalTransactions,
      totalPages: Math.ceil(totalTransactions / limit), // Calculate total pages
      currentPage: Number(page),
      transactions
    });
  } catch (error) {
    console.error("Error fetching transactions:", error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

// GET /transactions/:id - Fetch a single transaction by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the transaction by ID
    const transaction = await Transaction.findById(id).populate('category');

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Return the found transaction
    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction by ID:", error);

    // Handle invalid ObjectId format or any other error
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    res.status(500).json({ message: "Error fetching transaction", error });
  }
});


// PUT /transactions/:id - Update a transaction by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { type, category, amount, date, description } = req.body;

  try {
    // Validate input
    if (!type || !category || !amount || !date || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find and update the transaction by ID
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      {
        type,
        category,
        amount,
        date,
        description
      },
      { new: true, runValidators: true }
    ).populate('category');

    // Check if the transaction was found and updated
    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Return the updated transaction
    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);

    // Handle invalid ObjectId format or any other error
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    res.status(500).json({ message: "Error updating transaction", error });
  }
});


// DELETE /transactions/:id - Delete a transaction by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the transaction by ID
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    // If no transaction is found
    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Return success message
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);

    // Handle invalid ObjectId format or any other error
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    res.status(500).json({ message: "Error deleting transaction", error });
  }
});

// GET /reports/expenses - Generate a report of total expenses by month
router.get('/reports/expenses', async (req, res) => {
  try {
    const { startDate, endDate } = req.query; // Optional query parameters for date filtering

    // Build the query to filter by date range if provided
    let matchCriteria = { type: 'expense' };
    if (startDate && endDate) {
      matchCriteria.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    // MongoDB aggregation pipeline to group expenses by month and calculate totals
    const report = await Transaction.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: { $month: "$date" },  // Group by month
          totalExpenses: { $sum: "$amount" },  // Sum the amounts
        }
      },
      { $sort: { _id: 1 } }  // Sort by month
    ]);

    // Map month numbers to names for better readability
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const formattedReport = report.map(item => ({
      month: monthNames[item._id - 1],  // Convert month number to name
      totalExpenses: item.totalExpenses
    }));

    res.status(200).json(formattedReport);
  } catch (error) {
    console.error("Error generating expense report:", error);
    res.status(500).json({ message: "Error generating expense report", error });
  }
});


module.exports = router;
