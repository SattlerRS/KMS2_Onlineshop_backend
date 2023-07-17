const watchlistController = require("../controllers/watchlist.controller");
const token = require("../middleware/authJwt");

module.exports = function (app) {
    app.get("/api/watchlist/getWatchlistForUser/:userId",token.verifyToken, watchlistController.getWatchlistForUser);
    app.post('/api/watchlist/addProductToWatchlist',token.verifyToken, watchlistController.addProductToWatchlist);
    app.delete('/api/watchlist/removeFromWatchlist/:id',token.verifyToken, watchlistController.deleteWatchlistEntry);
    
};