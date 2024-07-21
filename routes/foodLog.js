const express = require('express');
const router = express.Router();
const FoodLog = require('../models/FoodLog');
const { authenticate } = require('../middleware/authenticate');
// const authenticate = require('../middleware/authenticate');

// Log food item
router.post('/log', authenticate, async (req, res) => {
  const { foodName, servingSize, calories, protein, fat, carbs, servingWeightGrams } = req.body;

  if (!foodName || !servingSize || calories === undefined || protein === undefined || fat === undefined || carbs === undefined || servingWeightGrams === undefined) {
    return res.status(400).json({ error: 'All nutritional values are required.' });
  }

  try {
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

// Update a food log entry
router.put('/log/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { foodName, servingSize, calories, protein, fat, carbs, servingWeightGrams } = req.body;

  if (!foodName || !servingSize || calories === undefined || protein === undefined || fat === undefined || carbs === undefined || servingWeightGrams === undefined) {
    return res.status(400).json({ error: 'All nutritional values are required.' });
  }

  try {
    const foodLog = await FoodLog.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { foodName, servingSize, calories, protein, fat, carbs, servingWeightGrams },
      { new: true }
    );

    if (!foodLog) {
      return res.status(404).json({ message: 'Food log not found' });
    }

    res.json(foodLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a food log entry
router.delete('/log/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const foodLog = await FoodLog.findOneAndDelete({ _id: id, userId: req.user.userId });

    if (!foodLog) {
      return res.status(404).json({ message: 'Food log not found' });
    }

    res.json({ message: 'Food log deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
