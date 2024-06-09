require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const vegetablesRoutes = require('./routes/vegRoutes');
const funfactRoutes = require('./routes/factRoutes');
const { Sequelize } = require('sequelize');

const app = express();

// Middleware
app.use(express.json()); // Parse request bodies as JSON
app.use(cookieParser());
app.use(helmet());

// Sequelize Instance
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '',
  username: 'root',
  password: '',
  database: '',
});

// Test Connection
sequelize.authenticate()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Routes
app.use('/api/auth', authRoutes);

//vegetable Routes
app.use('/api', vegetablesRoutes);

//fun fact routes
app.use('/api/fact', funfactRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});