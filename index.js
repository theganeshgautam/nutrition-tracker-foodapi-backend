const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const foodRoutes = require('./routes/food');
const authRoutes = require('./routes/auth');
const foodLogRoutes = require('./routes/foodLog');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/food', foodRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/foodlog', foodLogRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });
