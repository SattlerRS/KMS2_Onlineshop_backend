const productController = require("../controllers/product.controller");
const multer = require('multer');
const express = require('express');
const token = require("../middleware/authJwt");

// File Upload mit Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'productImgs/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Routen
module.exports = function (app) {
  app.use('/productImgs', express.static('productImgs')); // Zugriff auf productImgs-Ordner ermöglichen
  app.post("/api/products/add",token.verifyToken, upload.array('imgFiles'), productController.add);
  app.post("/api/products/change",token.verifyToken, upload.array('imgFiles'), productController.change);
  app.delete("/api/products/delete",token.verifyToken, productController.delete); 
  app.get('/api/products/getAll',token.verifyToken, productController.getProducts);
  app.get('/api/products/getProductForSeller/:sellerId',token.verifyToken, productController.getProductsForSeller);
  app.get('/api/products/getProduct/:productId',token.verifyToken, productController.getProduct);
  app.get('/api/products/getProductsForAdmin/:proofed',token.verifyToken, productController.getPorductsForAdmin);
  app.post('/api/products/releaseProduct', token.verifyToken, productController.releaseProduct);
  app.post('/api/products/lockProduct',token.verifyToken, productController.lockProduct);
  app.post('/api/products/releaseAll', token.verifyToken, productController.releaseAllProducts);
  app.post('/api/products/lockAll',token.verifyToken, productController.lockAllProducts);
};