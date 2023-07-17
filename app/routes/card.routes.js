const cardController = require("../controllers/card.controller");
const token = require("../middleware/authJwt");

module.exports = function (app) {

    app.post("/api/card/add",token.verifyToken, cardController.addToCard);
    app.post("/api/card/changeCartAmount",token.verifyToken, cardController.changeAmountInCard);
    app.get("/api/card/getCardForUser",token.verifyToken, cardController.getCardForUser);
    app.get("/api/card/getProductsFromCard",token.verifyToken, cardController.getProductsFromCard);
    app.delete("/api/card/delProductFromCard",token.verifyToken, cardController.delProductFromCard);
};