const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: String,
  nutrients: Object,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Food', foodSchema);
