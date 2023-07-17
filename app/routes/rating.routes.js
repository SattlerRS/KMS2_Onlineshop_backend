const ratingController = require("../controllers/rating.controller");
const token = require("../middleware/authJwt");

module.exports = function (app) {

    app.get("/api/rating/getRatingsForProduct/:productId",token.verifyToken, ratingController.getRatingsForProduct);

    app.post('/api/rating/addRating',token.verifyToken, ratingController.addRatingForProduct);
};