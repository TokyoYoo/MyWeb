// app.js - ไฟล์หลักของเว็บไซต์
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const app = express();
const fs = require('fs');

// app 
app.use(express.static('public'));

connectDB();

// Load environment variables
dotenv.config();

// google adsense
app.get('/ads.txt', (req, res) => {
  const adsPath = path.join(__dirname, 'Ads.txt');
  fs.readFile(adsPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).send('ads.txt not found');
    }
    res.setHeader('Content-Type', 'text/plain');
    res.send(data);
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://admin:eeUSxcB2qWiDKwVd@cluster0.1yxxo.mongodb.net/freemod', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key-for-freemod',
  resave: false,
  saveUninitialized: false
}));

// Global variables middleware
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/index'));
app.use('/mod', require('./routes/mod'));
app.use('/admin', require('./routes/admin'));

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));