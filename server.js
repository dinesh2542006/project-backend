require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const Alert = require('./models/Alert');

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '25042006';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json());

// Register user
app.post('/api/register', async (req, res) => {
  try {
    const { name, age, gender, address, contact, code } = req.body;
    if (!name || !age || !gender || !address || !contact || !code) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!/^\d{5}$/.test(code)) {
      return res.status(400).json({ error: 'Password must be a 5-digit code.' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this name already exists.' });
    }
    
    const user = new User({ name, age, gender, address, contact, code });
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { name, code } = req.body;
    const user = await User.findOne({ name, code });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { name, password } = req.body;
  if (!name || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }
  res.json({ success: true });
});

// Get all users (admin only)
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-__v');
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Receive alert from user
app.post('/api/alert', async (req, res) => {
  try {
    const { name, address, contact } = req.body;
    if (!name || !address || !contact) {
      return res.status(400).json({ error: 'Missing user details.' });
    }
    
    const alert = new Alert({
      name,
      address,
      contact,
      timestamp: new Date()
    });
    await alert.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Alert creation error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get all alerts (admin)
app.get('/api/admin/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find({}).select('-__v').sort({ timestamp: -1 });
    res.json({ alerts });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 