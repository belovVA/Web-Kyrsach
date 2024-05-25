const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
    photoUrl: String, // поле для хранения URL изображения
    description: String,
    date: Date,
    location: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
const Announcement = mongoose.model('Announcement', announcementSchema);

// Увеличение лимита полезной нагрузки
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, '../FrontEnd')));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.post('/uploadPhoto', (req, res) => {
  let photoData = '';

  req.on('data', chunk => {
      photoData += chunk;
  });

  req.on('end', () => {
      const photoBuffer = Buffer.from(photoData.split(',')[1], 'base64');
      const photoPath = path.join(uploadsDir, `${Date.now()}.jpg`);
      fs.writeFile(photoPath, photoBuffer, err => {
          if (err) {
              console.error('Ошибка при сохранении фото:', err);
              return res.status(500).send('Ошибка при сохранении фото');
          }
          res.json({ photoUrl: photoPath });
      });
  });
});

app.post('/createAd', async (req, res) => {
  const { title, photoUrl, description, date, location, userId } = req.body;

  try {
      const announcement = new Announcement({
          title,
          photoUrl,
          description,
          date,
          location,
          userId
      });
      await announcement.save();
      res.status(201).send('Объявление успешно добавлено!');
  } catch (error) {
      console.error('Ошибка при добавлении объявления:', error);
      res.status(500).send('Ошибка при добавлении объявления');
  }
});


// Маршрут для получения деталей объявления
app.get('/adDetail', async (req, res) => {
  const adId = req.query.id;
  console.log("ID:", adId);
  try {
      const ad = await Announcement.findById(adId); // Используем модель Announcement
      if (!ad) {
          return res.status(404).send('Объявление не найдено');
      }
      res.json(ad);
  } catch (error) {
      console.error(error);
      res.status(500).send('Ошибка при получении объявления');
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



app.get('/ads', async (req, res) => {
  const { sortByDate, filterStatus, daysRange } = req.query;
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - (daysRange || 365));

  let filter = { date: { $gte: dateLimit } };

  if (filterStatus !== undefined) {
    filter.status = filterStatus === 'true';
  }

  try {
    const ads = await Announcement.find(filter).sort(sortByDate ? { date: -1 } : {});
    console.log('Fetched ads:', ads); // Вывод данных в консоль
    res.json(ads);
  } catch (error) {
    console.error('Ошибка при получении объявлений:', error);
    res.status(500).send('Ошибка при получении объявлений');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
