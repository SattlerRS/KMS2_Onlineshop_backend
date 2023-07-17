const db = require('../models');
const Rating = db.rating;
const User = db.user;
const Product = db.product;



// Bewertungen für Produkt abrufen
exports.getRatingsForProduct = (req, res) => {
    const productId = req.params.productId;
    Rating
    .findAll({
      where: { productid: productId },
      include: [{ model: User }],
    })
    .then((ratings) => {
      res.send({ ratings });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
  
};

// Bewertungen für Produkt hinzufügen
exports.addRatingForProduct = (req, res) => {
    const { userid, productid, rating, header, text } = req.body;
  // Füge die Bewertung zur Datenbank hinzu
  Rating.create({
    userid,
    productid,
    rating,
    header,
    text,
  })
    .then((rating) => {
    // Alle Bewertungen abrufen  
    Rating.findAll({
        where: {
        productid: productid,
        },
    })
    .then((ratings) => {
      // Summiere die Bewertungen
      let totalRating = 0;
      ratings.forEach((rating) => {
        totalRating += rating.rating;
      });

      // Berechne den Durchschnitt
      const averageRating = Math.round(totalRating / ratings.length);

      console.log(averageRating);
      console.log(productid);
      // Produktrating updaten
      Product.update(
        { rating: averageRating },
        { where: { id: productid } }
      )
        .then(() => {
          res.status(200).send({ averageRating });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
    });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
    });
};
