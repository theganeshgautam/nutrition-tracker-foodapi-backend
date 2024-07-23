// const mongoose = require('mongoose');

// const FoodLogSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   foodName: {
//     type: String,
//     required: true
//   },
//   servingSize: {
//     type: String,
//     required: true
//   },
//   servingWeightGrams: {
//     type: Number,
//     required: true
//   },
//   calories: {
//     type: Number,
//     required: true
//   },
//   protein: {
//     type: Number,
//     required: true
//   },
//   fat: {
//     type: Number,
//     required: true
//   },
//   carbs: {
//     type: Number,
//     required: true
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('FoodLog', FoodLogSchema);




// FoodLog.js
const mongoose = require('mongoose');

const foodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodName: { type: String, required: true },
  servingQty: { type: Number, required: true },
  servingUnit: { type: String, required: true },
  servingWeightGrams: { type: Number, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  fat: { type: Number, required: true },
  carbs: { type: Number, required: true },
  cholesterol: { type: Number, required: true },
  sodium: { type: Number, required: true },
  sugars: { type: Number, required: true },
  potassium: { type: Number, required: true },
  photo: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('FoodLog', foodLogSchema);

