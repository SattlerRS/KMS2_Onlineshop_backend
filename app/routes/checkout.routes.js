const checkoutController = require("../controllers/checkout.controller");
const token = require("../middleware/authJwt");


module.exports = function (app) {

    app.post("/api/checkout/addOrdersDeleteCard",token.verifyToken, checkoutController.addOrdersAndDeleteCard);
 }
