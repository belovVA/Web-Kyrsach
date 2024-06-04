const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const routes = require('./routes/routes');

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/lostAndFound', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from FrontEnd directory
app.use(express.static(path.join(__dirname, '../client')));

// Serve uploads directory

// Routes
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}`);
});
