const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
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

const announcementSchema = new mongoose.Schema({
  title: String,
  photo: String,
  description: String,
  date: Date,
  location: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
const Announcement = mongoose.model('Announcement', announcementSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../FrontEnd')));

// Настройка хранения файлов с использованием multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Используем текущую дату для имени файла
  }
});

const upload = multer({ storage: storage });

app.post('/createAd', upload.single('photo'), async (req, res) => {
    const { title, description, date, location, userId } = req.body;
    const photo = req.file ? req.file.filename : null;

    try {
        const announcement = new Announcement({
            title,
            photo,
            description,
            date,
            location,
            userId
        });
        await announcement.save();
        res.status(201).send('Объявление успешно добавлено!');
    } catch (error) {
        res.status(500).send('Ошибка при добавлении объявления');
    }
});


// Регистрация
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

// Логин
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

// Загрузка профиля пользователя
app.get('/profile/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        res.status(500).send('Error loading user profile');
    }
});

// Редактирование профиля пользователя
app.put('/profile/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { lastName, firstName, middleName, phone, password } = req.body;
    let updatedProfile = { lastName, firstName, middleName, phone };

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedProfile.password = hashedPassword;
    }

    try {
        await User.findByIdAndUpdate(userId, updatedProfile);
        res.status(200).send('Profile updated successfully');
    } catch (error) {
        res.status(500).send('Error updating user profile');
    }
});

app.post('/createAd', (req, res) => {
  const adData = req.body;

  // Далее можно добавить код для сохранения объявления в базу данных или другие действия
  
  // Пример ответа
  res.status(201).send('Объявление успешно добавлено!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/ads', async (req, res) => {
  const { sortByDate } = req.query;

  try {
      const ads = await Announcement.find({ status: false }).sort({ date: -1 });
      res.json(ads);
  } catch (error) {
      res.status(500).send('Ошибка при получении объявлений');
  }
});