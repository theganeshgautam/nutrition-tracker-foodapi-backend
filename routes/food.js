const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

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

module.exports = router;
