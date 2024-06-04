const Announcement = require('../models/announcementModel');
const User = require('../models/userModel');

const createAd = async (req, res) => {
  const { title, description, date, location, userId, photoUrl } = req.body;

  try {
      const announcement = new Announcement({
          title,
          description,
          date,
          location,
          userId,
          photoUrl
      });
      await announcement.save();
      res.status(201).send('Объявление успешно добавлено!');
  } catch (error) {
      console.error('Ошибка при добавлении объявления:', error);
      res.status(500).send('Ошибка при добавлении объявления');
  }
};

const getAdDetail = async (req, res) => {
  const adId = req.query.id;
  try {
      const ad = await Announcement.findById(adId);
      if (!ad) {
          return res.status(404).send('Объявление не найдено');
      }

      const user = await User.findById(ad.userId);
      if (!user) {
          return res.status(404).send('Пользователь не найден');
      }

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
};

const updateAd = async (req, res) => {
  const { id, title, description, date, location, status, moderationStatus, photoUrl } = req.body;

  try {
      const updatedAd = await Announcement.findByIdAndUpdate(id, {
          title,
          description,
          date,
          location,
          status,
          moderationStatus,
          photoUrl
      }, { new: true });
      res.json(updatedAd);
  } catch (error) {
      console.error('Ошибка при обновлении объявления:', error);
      res.status(500).send('Ошибка при обновлении объявления');
  }
};

const deleteAd = async (req, res) => {
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
};

const getUserAds = async (req, res) => {
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
};

const getAds = async (req, res) => {
  const { sortByDate, filterStatus, daysRange } = req.query;
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - (daysRange || 365));

  let filter = { 
      date: { $gte: dateLimit },
      moderationStatus: 'Accepted' 
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
};

const updateAdStatus = async (req, res) => {
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
};

const getAdsModeration = async (req, res) => {
  const { moderationStatus } = req.query;
  
  const filter = {};
  if (moderationStatus) {
      filter.moderationStatus = moderationStatus;
  }

  try {
      const ads = await Announcement.find(filter);
      res.json(ads);
  } catch (error) {
      console.error('Ошибка при получении объявлений:', error);
      res.status(500).send('Ошибка при получении объявлений');
  }
};

module.exports = {
  createAd,
  getAdDetail,
  updateAd,
  deleteAd,
  getUserAds,
  getAds,
  updateAdStatus,
  getAdsModeration
};
