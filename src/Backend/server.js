const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
const PORT = 3000;
const JWT_SECRET = 'your_jwt_secret';

mongoose.connect('mongodb://localhost:27017/lostAndFound', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    lastName: String,
    firstName: String,
    middleName: String,
    phone: { type: String, unique: true },
    birthday: Date,
    password: String
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../FrontEnd'))); // Обслуживание статических файлов

app.post('/register', async (req, res) => {
    const { lastName, firstName, middleName, phone, birthday, password } = req.body;
    
    if (!lastName || !firstName || !phone || !birthday || !password) {
        return res.status(400).send('All fields are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            lastName,
            firstName,
            middleName,
            phone,
            birthday,
            password: hashedPassword
        });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).send('All fields are required');
    }

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ userId: user._id, token });
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
