const ordersController = require("../controllers/orders.controller");
const token = require("../middleware/authJwt");

module.exports = function (app) {
    app.get("/api/orders/getAll/:userId",token.verifyToken, ordersController.getOrdersForUser);
    app.get("/api/orders/getAllForSeller/:sellerid",token.verifyToken, ordersController.getOrdersForSeller);
    app.post("/api/orders/changeOrderStatus",token.verifyToken, ordersController.changeOrderDetailStatus);
 }
