const express = require('express');
const jwt = require('jsonwebtoken');
const FoodLog = require('../models/FoodLog');
const Food = require('../models/Food');
const router = express.Router();
const authenticate = require('../middleware/authenticate');  // Import the middleware

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate the user
// This line is no longer necessary since we are importing the middleware
// const authenticate = (req, res, next) => {
//   const token = req.header('Authorization').replace('Bearer ', '');
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// };

// Log food item
router.post('/log', authenticate, async (req, res) => {
  const { foodName, servingSize, calories, protein, fat, carbs, servingWeightGrams } = req.body;

  if (!foodName || !servingSize || calories === undefined || protein === undefined || fat === undefined || carbs === undefined || servingWeightGrams === undefined) {
    return res.status(400).json({ error: 'All nutritional values are required.' });
  }

  try {
    const food = await Food.findOne({ name: foodName });

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    const foodLog = new FoodLog({
      userId: req.user.userId,
      foodName,
      servingSize,
      calories,
      protein,
      fat,
      carbs,
      servingWeightGrams
    });

    await foodLog.save();
    res.status(201).json(foodLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's food logs
router.get('/logs', authenticate, async (req, res) => {
  try {
    const foodLogs = await FoodLog.find({ userId: req.user.userId });
    res.json(foodLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
