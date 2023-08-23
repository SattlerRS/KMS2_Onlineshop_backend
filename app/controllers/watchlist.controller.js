const db = require('../models');
const Watchlist = db.watchlist;
const Product = db.product;

// Watchlist für User abrufen
exports.getWatchlistForUser = (req, res) => {
  const userId = req.params.userId;

  Watchlist.findAll({
    where: {
      userid: userId
    },
    include: [{
      model: Product
    }]
  })
  .then(watchlistItems => {
    res.json(watchlistItems);
  })
  .catch(error => {
    res.status(500).send('Error getting watchlist');
  });
};

// Produkt zur Watchlist hinzufügen
exports.addProductToWatchlist = (req, res) => {
    const { userId, productId } = req.body;

  Watchlist.create({
    userid: userId,
    productid: productId
  })
  .then(watchlistItem => {
    res.json({ message: 'Product added to watchlist', watchlistItem });
  })
  .catch(error => {
    res.status(500).send('Error adding product to watchlist');
  });
}

// Watchlisteintrag löschen
exports.deleteWatchlistEntry = (req, res) => { 
    const id = req.params.id;

    Watchlist.destroy({
        where: {
        id: id
        }
    })
    .then(deletedCount => {
        if (deletedCount === 0) {
        return res.status(404).json({ error: 'Entry in watchlist not found' });
        }

        res.status(200).json({ message: 'Entry in the watch list successfully deleted' });
    })
    .catch(error => {
        res.status(500).json({ error: 'Error deleting watchlist entry' });
    });
}