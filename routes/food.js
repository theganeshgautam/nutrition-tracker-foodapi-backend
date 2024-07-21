const express = require('express');
const router = express.Router();
const axios = require('axios');
const Food = require('../models/Food');
const { authenticate } = require('../middleware/authenticate');
require('dotenv').config();
// const authenticate = require('../middleware/authenticate');

const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;

// Route to search for food items
router.get('/search/:query', async (req, res) => {
  const query = req.params.query;
  try {
    const response = await axios.get(`https://trackapi.nutritionix.com/v2/search/instant`, {
      params: { query },
      headers: {
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Route to get detailed nutritional information
router.get('/item/:foodName', async (req, res) => {
  const foodName = req.params.foodName;
  try {
    const response = await axios.post(`https://trackapi.nutritionix.com/v2/natural/nutrients`, {
      query: foodName
    }, {
      headers: {
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Add a new food item - ensure all nutritional values are provided
router.post('/', async (req, res) => {
  const { name, servingSize, servingWeightGrams, calories, protein, fat, carbs } = req.body;

  if (!name || !servingSize || servingWeightGrams === undefined || calories === undefined || protein === undefined || fat === undefined || carbs === undefined) {
    return res.status(400).json({ error: 'All nutritional values are required.' });
  }

  try {
    const food = new Food({
      name,
      servingSize,
      servingWeightGrams,
      calories,
      protein,
      fat,
      carbs
    });

    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get food item by name
router.get('/:name', async (req, res) => {
  try {
    const food = await Food.findOne({ name: req.params.name });
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to fetch and store food items - only for authenticated users
router.post('/addFood', authenticate, async (req, res) => {
  const { query } = req.body;

  try {
    const response = await axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      query
    }, {
      headers: {
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const foodData = response.data.foods[0];

    if (!foodData.food_name || !foodData.serving_unit || foodData.serving_weight_grams === undefined || foodData.nf_calories === undefined || foodData.nf_protein === undefined || foodData.nf_total_fat === undefined || foodData.nf_total_carbohydrate === undefined) {
      return res.status(400).json({ error: 'All nutritional values are required from the API.' });
    }

    const food = new Food({
      name: foodData.food_name,
      servingSize: foodData.serving_unit,
      servingWeightGrams: foodData.serving_weight_grams,
      calories: foodData.nf_calories,
      protein: foodData.nf_protein,
      fat: foodData.nf_total_fat,
      carbs: foodData.nf_total_carbohydrate
    });

    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
