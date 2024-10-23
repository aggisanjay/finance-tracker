const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const reportRoutes = require('./routes/reports');
const categoriesRoute = require('./routes/categories');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO);

// Routes
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use('/reports', reportRoutes);
app.use('/categories', categoriesRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
