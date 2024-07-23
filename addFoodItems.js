// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const axios = require('axios');
// const Food = require('./models/Food');

// dotenv.config();

// const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
// const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(async () => {
//     console.log('Connected to MongoDB');

//     // Define the food items you want to fetch
//     const foodItems = ['apple', 'banana', 'orange'];

//     for (const foodItem of foodItems) {
//       try {
//         // Fetch food item details from Nutritionix API
//         const response = await axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {
//           query: foodItem
//         }, {
//           headers: {
//             'x-app-id': NUTRITIONIX_APP_ID,
//             'x-app-key': NUTRITIONIX_API_KEY,
//             'Content-Type': 'application/json'
//           }
//         });

//         const foodData = response.data.foods[0];

//         // Create a new Food document
//         const food = new Food({
//           name: foodData.food_name,
//           servingSize: foodData.serving_unit,
//           calories: foodData.nf_calories,
//           protein: foodData.nf_protein,
//           fat: foodData.nf_total_fat,
//           carbs: foodData.nf_total_carbohydrate
//         });

//         // Save the food item to MongoDB
//         await food.save();
//         console.log(`Food item '${foodData.food_name}' added`);
//       } catch (error) {
//         console.error(`Error fetching data for '${foodItem}':`, error.message);
//       }
//     }

//     console.log('Food items added');
//     process.exit();
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB', error);
//   });





const axios = require('axios');
const mongoose = require('mongoose');
const Food = require('../models/Food');
require('dotenv').config();

const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error(err));

const predefinedFoodItems = ['apple', 'banana', 'chicken breast'];

const addFoodItems = async () => {
  try {
    for (const item of predefinedFoodItems) {
      const response = await axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {
        query: item
      }, {
        headers: {
          'x-app-id': NUTRITIONIX_APP_ID,
          'x-app-key': NUTRITIONIX_API_KEY,
          'Content-Type': 'application/json'
        }
      });

      const foodData = response.data.foods[0];

      if (!foodData.food_name || !foodData.serving_unit || foodData.serving_weight_grams === undefined || foodData.nf_calories === undefined || foodData.nf_protein === undefined || foodData.nf_total_fat === undefined || foodData.nf_total_carbohydrate === undefined) {
        console.error(`Incomplete data for ${item}, skipping...`);
        continue;
      }

      const food = new Food({
        name: foodData.food_name,
        servingSize: foodData.serving_qty + ' ' + foodData.serving_unit,
        servingWeightGrams: foodData.serving_weight_grams,
        calories: foodData.nf_calories,
        protein: foodData.nf_protein,
        fat: foodData.nf_total_fat,
        carbs: foodData.nf_total_carbohydrate,
        cholesterol: foodData.nf_cholesterol,
        sodium: foodData.nf_sodium,
        sugars: foodData.nf_sugars,
        potassium: foodData.nf_potassium,
        photo: foodData.photo
      });

      await food.save();
      console.log(`Added ${food.name} to the database.`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
};

addFoodItems();
