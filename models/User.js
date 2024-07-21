const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  activityLevel: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'super admin'], default: 'user' },
  dietaryPreferences: { type: [String], enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'none'], default: ['none'] },
  bmi: { type: Number, required: false },
  disease: { type: String, required: false },
  calorieLimit: { type: Number, required: false }, // Daily calorie limit
  carbLimit: { type: Number, required: false }, // Daily carbohydrate limit (grams)
  proteinLimit: { type: Number, required: false }, // Daily protein limit (grams)
  bmr: { type: Number, required: false }, // Basal Metabolic Rate
  dateCreated: { type: Date, default: Date.now } // Automatically set the date when user is created
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
