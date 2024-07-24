const express = require('express');
const router = express.Router();
const FoodLog = require('../models/FoodLog');
const { authenticate } = require('../middleware/authenticate');

// Log a food item (add food item to foodlog)
router.post('/log', authenticate, async (req, res) => {
  const { foodName, servingQty, servingUnit, servingWeightGrams, calories, protein, fat, carbs, cholesterol, sodium, sugars, potassium, photo } = req.body;

  // Log the received payload
  console.log('Received payload:', req.body);

  if (!foodName || servingQty === undefined || !servingUnit || servingWeightGrams === undefined || calories === undefined || protein === undefined || fat === undefined || carbs === undefined || cholesterol === undefined || sodium === undefined || sugars === undefined || potassium === undefined || !photo) {
    console.error('Invalid payload:', req.body);
    return res.status(400).json({ error: 'All nutritional values are required.' });
  }

  try {
    const foodLog = new FoodLog({
      userId: req.user.userId,
      foodName,
      servingQty,
      servingUnit,
      servingWeightGrams,
      calories,
      protein,
      fat,
      carbs,
      cholesterol,
      sodium,
      sugars,
      potassium,
      photo
    });

    await foodLog.save();
    res.status(201).json(foodLog);
  } catch (error) {
    console.error('Error saving food log:', error);
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
  const { foodName, servingQty, servingUnit, servingWeightGrams, calories, protein, fat, carbs, cholesterol, sodium, sugars, potassium, photo } = req.body;

  // Check if all required fields are provided
  if (!foodName || servingQty === undefined || !servingUnit || servingWeightGrams === undefined || calories === undefined || protein === undefined || fat === undefined || carbs === undefined || cholesterol === undefined || sodium === undefined || sugars === undefined || potassium === undefined || !photo) {
    return res.status(400).json({ error: 'All nutritional values are required.' });
  }

  try {
    // Find and update the food log entry
    const updatedFoodLog = await FoodLog.findOneAndUpdate(
      { _id: id, userId: req.user.userId }, // Ensure the log belongs to the authenticated user
      { foodName, servingQty, servingUnit, servingWeightGrams, calories, protein, fat, carbs, cholesterol, sodium, sugars, potassium, photo },
      { new: true } // Return the updated document
    );

    if (!updatedFoodLog) {
      return res.status(404).json({ message: 'Food log not found or not authorized.' });
    }

    res.json(updatedFoodLog);
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
