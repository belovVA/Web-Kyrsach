const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const userController = require('../controllers/userController');
const announcementController = require('../controllers/announcementController');

const router = express.Router();

const uploadsDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

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

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile/:userId', userController.getProfile);
router.put('/profile/:userId', userController.updateProfile);
router.delete('/profile/:userId', userController.deleteProfile);
router.post('/usersNew', userController.userNewCreate);
router.get('/users', userController.usersList);
router.get('/usersByRole',userController.sortedUserByRole);

// Announcement routes
router.post('/createAd', announcementController.createAd);
router.get('/adDetail', announcementController.getAdDetail);
router.put('/updateAd', announcementController.updateAd);
router.delete('/deleteAd', announcementController.deleteAd);
router.get('/user-ads', announcementController.getUserAds);
router.get('/ads', announcementController.getAds);
router.post('/updateAdStatus', announcementController.updateAdStatus);
router.get('/adsModeration', announcementController.getAdsModeration);

// Photo upload route
router.post('/uploadPhoto', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Не удалось загрузить файл');
  }
  
  const photoUrl = req.file.filename; 
  res.json({ photoUrl });
});

router.use(express.static(path.join(__dirname, '../client/')));

// Routes for serving HTML files
const setRoute = (routePath, filePath) => {
  router.get(routePath, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', filePath));
  });
};
setRoute('/adDetail', 'AdDetail/adDetail.html');
setRoute('/admin/createUser', 'admin/createUser.html');
setRoute('/admin/manageAccounts', 'admin/manageAccounts.html');
setRoute('/advert/createAd', 'Advert/createAd.html');
setRoute('/editAd', 'EditAd/editAd.html');
setRoute('/login', 'LoginOrRegistration/login.html');
setRoute('/moderator/checkAds', 'moderator/checkAds.html');
setRoute('/moderator/moderationAds', 'moderator/moderationAds.html');
setRoute('/myAds', 'MyAds/myAds.html');
setRoute('/profDate', 'profDate/profDate.html');
setRoute('/main', 'main/main.html', 'main/main.css', 'main/main.js');
module.exports = router;
