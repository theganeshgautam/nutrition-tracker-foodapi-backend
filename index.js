const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const foodRoutes = require('./routes/food');
const foodLogRoutes = require('./routes/foodLog');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
const cors = require('cors');
app.use(cors());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/food', foodRoutes);
app.use('/foodLog', foodLogRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
