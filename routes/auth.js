const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Function to calculate BMI
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100; // Convert height from cm to meters
  return weight / (heightInMeters * heightInMeters);
};

// Function to calculate BMR
const calculateBMR = (weight, height, age, sex) => {
  if (sex === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else if (sex === 'female') {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  return null; // Invalid sex
};

// Registration route
router.post('/register', async (req, res) => {
  const { username, password, name, email, age, sex, height, weight, phoneNumber, activityLevel, role } = req.body;

  if (!username || !password || !name || !email || !age || !sex || !height || !weight || !phoneNumber || !activityLevel) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Calculate BMI and BMR
    const bmi = calculateBMI(weight, height);
    const bmr = calculateBMR(weight, height, age, sex);

    const user = new User({
      username,
      password: hashedPassword,
      name,
      email,
      age,
      sex,
      height,
      weight,
      phoneNumber,
      activityLevel,
      role,
      bmi, // Add BMI to user data
      bmr  // Add BMR to user data
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;





// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const router = express.Router();
// require('dotenv').config();

// const JWT_SECRET = process.env.JWT_SECRET;

// // Registration route
// router.post('/register', async (req, res) => {
//   const { username, password, name, email, age, sex, height, weight, phoneNumber, activityLevel, role } = req.body;

//   if (!username || !password || !name || !email || !age || !sex || !height || !weight || !phoneNumber || !activityLevel) {
//     return res.status(400).json({ error: 'All fields are required.' });
//   }

//   try {
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Username already exists.' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({
//       username,
//       password: hashedPassword,
//       name,
//       email,
//       age,
//       sex,
//       height,
//       weight,
//       phoneNumber,
//       activityLevel,
//       role
//     });

//     await user.save();
//     res.status(201).json({ message: 'User registered successfully.' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Login route
// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ error: 'Username and password are required.' });
//   }

//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ error: 'Invalid username or password.' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid username or password.' });
//     }

//     const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
