const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const JWT_SECRET = 'your_jwt_secret';

const register = async (req, res) => {
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
};

const login = async (req, res) => {
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
};

const getProfile = async (req, res) => {
  const userId = req.params.userId;
// console.log(userId);
  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).send('User not found');
      }
      
      res.json(user);
  } catch (error) {
      res.status(500).send('Error loading user profile');
  }
};

const updateProfile = async (req, res) => {
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
};

const deleteProfile = async (req, res) => {
  const userId = req.params.userId;

  try {
      await User.findByIdAndDelete(userId);
      res.status(200).send('User deleted successfully');
  } catch (error) {
      res.status(500).send('Error deleting user');
  }
};

const userNewCreate =  async (req, res) => {
  const { lastName, firstName, middleName, phone, role, password } = req.body;

  try {
    // console.log('Received data:', req.body);
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
};

// Получение списка пользователей
const usersList = async (req, res) => {
  const { searchQuery, role } = req.query;

  try {
      let users;
      const filter = {}; // Инициализируем пустой фильтр
      if (searchQuery) {
          // Поиск по различным полям схемы
          filter.$or = [
                  { lastName: { $regex: searchQuery, $options: 'i' } },
                  { firstName: { $regex: searchQuery, $options: 'i' } },
                  { middleName: { $regex: searchQuery, $options: 'i' } },
                  { phone: { $regex: searchQuery, $options: 'i' } },
                  
                  // Другие поля, если необходимо добавить их в поиск
              ];
          
      } 
      if (role && role !== '') {
        filter.role = role; // Добавляем значение роли в фильтр, если оно передано
      }
  
      // Используем фильтр при поиске пользователей
      users = await User.find(filter);
      res.json(users);
  } catch (error) {
      console.error('Ошибка при получении списка пользователей:', error);
      res.status(500).send('Ошибка при получении списка пользователей');
  }
};

// Получение списка пользователей по роли
const sortedUserByRole =  async (req, res) => {
  const { role } = req.query;

  try {
      const users = await User.find({ role });
      res.json(users);
  } catch (error) {
      res.status(500).send('Ошибка при получении списка пользователей');
  }
};


module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
  userNewCreate,
  usersList,
  sortedUserByRole
};
