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
    console.error('Fehler beim Abrufen der Watchlist:', error);
    res.status(500).send('Fehler beim Abrufen der Watchlist');
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
    res.json({ message: 'Produkt zur Watchlist hinzugefügt', watchlistItem });
  })
  .catch(error => {
    console.error('Fehler beim Hinzufügen des Produkts zur Watchlist:', error);
    res.status(500).send('Fehler beim Hinzufügen des Produkts zur Watchlist');
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
        return res.status(404).json({ error: 'Eintrag in der Watchlist nicht gefunden' });
        }

        res.status(200).json({ message: 'Eintrag in der Watchlist erfolgreich gelöscht' });
    })
    .catch(error => {
        console.error('Fehler beim Löschen des Watchlist-Eintrags:', error);
        res.status(500).json({ error: 'Fehler beim Löschen des Watchlist-Eintrags' });
    });
}