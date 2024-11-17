const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect('mongodb+srv://mindmelders05:mindmelders05@cluster0.cltov.mongodb.net/myDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Mongoose Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  cgpa: { type: Number, required: true },
  skills: { type: String, required: true },
  certifications: { type: String, required: true },
  experience: { type: Number, required: true },
});

const User = mongoose.model('User', userSchema);

// POST Route to Save User
app.post('/saveUser', async (req, res) => {
  const { name, email, phone, cgpa, skills, certifications, experience } = req.body;

  // Validate input
  if (!name || !email || !phone || !cgpa || !skills || !certifications || experience === undefined) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  try {
    const user = new User({ name, email, phone, cgpa, skills, certifications, experience });
    await user.save();
    console.log('User saved:', user);
    res.status(201).json({ message: 'User saved successfully!', user });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ error: 'Failed to save user.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
