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

// Обслуживание статических файлов из директории "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://localhost:27017/lostAndFound', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    lastName: String,
    firstName: String,
    middleName: String,
    phone: { type: String, unique: true },
    birthday: Date,
    password: String,
    role: { type: String, default: 'user' }
});

    const announcementSchema = new mongoose.Schema({
        title: String,
        photoUrl: String, // поле для хранения URL изображения
        description: String,
        date: Date,
        location: String,
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: Boolean, default: false },
        moderationStatus: {
          type: String,
          enum: ['Watching', 'Accepted', 'Canceled'],
          default: 'Watching'
      }
    });

const User = mongoose.model('User', userSchema);
const Announcement = mongoose.model('Announcement', announcementSchema);

// Увеличение лимита полезной нагрузки
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, '../FrontEnd')));

const uploadsDir = path.join(__dirname, '../Frontend/uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
const multer = require('multer');

// Создаем хранилище для загруженных файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage: storage });

// Инициализируем загрузчик multer

// Маршрут для загрузки фото
app.post('/uploadPhoto', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Не удалось загрузить файл');
  }
  
  const photoUrl = req.file.filename; // Имя файла без пути
  res.json({ photoUrl });
});




app.post('/createAd', async (req, res) => {
  const { titll, description, date, location, userId } = req.body;

  try {
      // Извлекйла из URL изображения
      let photoFileName = '';
      if (photodefined){
          phot= photoUrl.split('/').pop();
      } 

      const announcement = new Announcement({
              photoFileName, // Сохраняем только имя файла
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
// Маршрут для получения деталей объявления
app.get('/adDetail', async (req, res) => {
  const adId = req.query.id;
  console.log("ID:", adId);
  try {
      const ad = await Announcement.findById(adId);
      if (!ad) {
          return res.status(404).send('Объявление не найдено');
      }

      // Найдем пользователя по userId
      const user = await User.findById(ad.userId);
      if (!user) {
          return res.status(404).send('Пользователь не найден');
      }

      // Добавим данные пользователя к объявлению
      const adDetail = {
          ...ad.toObject(),
          name: `${user.firstName} ${user.lastName}`,
          phone: user.phone
      };

      res.json(adDetail);
  } catch (error) {
      console.error(error);
      res.status(500).send('Ошибка при получении объявления');
  }
});


// Маршрут для обновления объявления
// Маршрут для обновления объявления
app.put('/updateAd', async (req, res) => {
  const { id, title, description, date, location, status, moderationStatus, name, phone, photoUrl } = req.body;

  try {
      const updatedAd = await Announcement.findByIdAndUpdate(id, {
          title,
          description,
          date,
          location,
          status,
          moderationStatus,
          name,
          phone,
          photoUrl
      }, { new: true });
      res.json(updatedAd);
  } catch (error) {
      console.error('Ошибка при обновлении объявления:', error);
      res.status(500).send('Ошибка при обновлении объявления');
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
          password: hashedPassword,
          role: 'user' 
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

app.delete('/deleteAd', async (req, res) => {
  const { id } = req.body;

  try {
      const ad = await Announcement.findById(id);
      if (ad) {
          await Announcement.findByIdAndDelete(id);
          res.status(200).send({ message: 'Объявление успешно удалено' });
      } else {
          res.status(404).send({ message: 'Объявление не найдено' });
      }
  } catch (error) {
      console.error('Ошибка при удалении объявления:', error);
      res.status(500).send('Ошибка при удалении объявления');
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

// Удаление учетной записи пользователя
app.delete('/profile/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
      await User.findByIdAndDelete(userId);
      res.status(200).send('User deleted successfully');
  } catch (error) {
      res.status(500).send('Error deleting user');
  }
});


// Маршрут для получения объявлений пользователя по userId
app.get('/user-ads', async (req, res) => {
  const { userId, sortByDate, filterStatus, daysRange } = req.query;
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - (daysRange || 365));

  let filter = { date: { $gte: dateLimit }, userId: userId };

  if (filterStatus !== undefined) {
      if (filterStatus === 'true' || filterStatus === 'false') {
          filter.status = filterStatus === 'true';
      }
  }

  try {
      const ads = await Announcement.find(filter).sort(sortByDate ? { date: -1 } : {});
      
      // Группировка объявлений по moderationStatus
      const groupedAds = ads.reduce((acc, ad) => {
          const status = ad.moderationStatus;
          if (!acc[status]) {
              acc[status] = [];
          }
          acc[status].push(ad);
          return acc;
      }, {});

      res.json(groupedAds);
  } catch (error) {
      console.error('Ошибка при получении объявлений:', error);
      res.status(500).send('Ошибка при получении объявлений');
  }
});

app.get('/ads', async (req, res) => {
  const { sortByDate, filterStatus, daysRange } = req.query;
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - (daysRange || 365));

  let filter = { 
      date: { $gte: dateLimit },
      moderationStatus: 'Accepted' // Добавлено условие фильтрации
  };
  
  if (filterStatus !== undefined) {
      if (filterStatus === 'true' || filterStatus === 'false') {
          filter.status = filterStatus === 'true';
      }
  }

  try {
      const ads = await Announcement.find(filter).sort(sortByDate ? { date: -1 } : {});
      res.json(ads);
  } catch (error) {
      console.error('Ошибка при получении объявлений:', error);
      res.status(500).send('Ошибка при получении объявлений');
  }
});


  app.post('/usersNew', async (req, res) => {
    const { lastName, firstName, middleName, phone, role, password } = req.body;

    try {
      console.log('Received data:', req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            lastName,
            firstName,
            middleName,
            phone,
            role,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(500).send('Error creating user');
    }
});

  // Получение списка пользователей
app.get('/users', async (req, res) => {
  try {
      const users = await User.find();
      res.json(users);
  } catch (error) {
      res.status(500).send('Ошибка при получении списка пользователей');
  }
});

// Получение списка пользователей по роли
app.get('/usersByRole', async (req, res) => {
  const { role } = req.query;

  try {
      const users = await User.find({ role });
      res.json(users);
  } catch (error) {
      res.status(500).send('Ошибка при получении списка пользователей');
  }
});

// Получение отсортированного списка пользователей
app.get('/sortedUsers', async (req, res) => {
  const { sortBy } = req.query;

  try {
      const users = await User.find().sort(sortBy);
      res.json(users);
  } catch (error) {
      res.status(500).send('Ошибка при получении списка пользователей');
  }
});

app.get('/adsModeration', async (req, res) => {
  const {moderationStatus } = req.query;
  
  const filter = {};
  
  // if (moderationStatus) {
  // console.log(moderationStatus);

      filter.moderationStatus = moderationStatus;
      console.log(filter);
      console.log(filter.moderationStatus);

  // }

  try {
      let ads;
      
          ads = await Announcement.find(filter);
      res.json(ads);
  } catch (error) {
      console.error('Ошибка при получении объявлений:', error);
      res.status(500).send('Ошибка при получении объявлений');
  }
});

// Маршрут для обновления статуса модерации объявления
app.post('/updateAdStatus', async (req, res) => {
  const { id, moderationStatus } = req.body;
  if (!id || !moderationStatus) {
      return res.status(400).send('Invalid request');
  }

  try {
      const ad = await Announcement.findByIdAndUpdate(id, { moderationStatus }, { new: true });
      if (!ad) {
          return res.status(404).send('Announcement not found');
      }
      res.json(ad);
  } catch (error) {
      console.error('Ошибка при обновлении статуса объявления:', error);
      res.status(500).send('Ошибка при обновлении статуса объявления');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
