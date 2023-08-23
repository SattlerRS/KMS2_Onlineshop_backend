const profileController = require("../controllers/profile.controller");
const multer = require('multer');
const express = require('express');
const token = require("../middleware/authJwt");

// File Upload mit Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'profilImgs/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Routen
module.exports = function (app) {
  app.get('/api/profile/getProfileForSeller/:sellerId',token.verifyToken, profileController.getProfileForSeller);
  app.get('/api/profile/getProfileForUser/:userId',token.verifyToken, profileController.getProfileForUser);
  app.post('/api/profile/updateSeller',token.verifyToken, upload.single('image'), profileController.updateSellerProfile);
  app.post('/api/profile/updateUser',token.verifyToken, profileController.updateUserProfile);
  app.post('/api/profile/updateUserWithImage',token.verifyToken, upload.single('image'), profileController.updateUserProfileWithImage);
  app.use('/profilImgs', express.static('profilImgs'));
  
};