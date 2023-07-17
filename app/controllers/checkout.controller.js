const db = require('../models');
const Order = db.order;
const Orderdetail = db.orderdetails;
const Card = db.card;
const Product = db.product;


// Erstellt Bestellungen in der Datenbank und löscht den Warenkorb des Users
exports.addOrdersAndDeleteCard = (req, res) => {
  const { totalprice, userid, card } = req.body;

    //Bestellung in der DB erstellen
    Order.create({
        userid: userid,
        price: totalprice
    })
    .then(order => {
        const orderDetailsPromises = card.cards.map(cardItem => {
            console.log(cardItem);
            const product = cardItem.product;
            
            // Bestelldetails in der DB erstellen
            return Orderdetail.create({
                orderid: order.id,
                price: product.productprice,
                amount: cardItem.amount,
                productname: product.productname,
                productdescription: product.productdescription,
                productcategorie: product.productcategorie,
                sellerid: product.sellerid,
                productid: product.id,
                productprice: product.productprice,
                images: product.images,
                status: 'bestellt'
            })
            .then(orderDetail => {
        // Menge zum Feld "sold" im Produktmodell hinzufügen
        return Product.findByPk(cardItem.productid)
          .then(foundProduct => {
            foundProduct.sold += cardItem.amount; // Menge addieren
            return foundProduct.save(); // Produkt speichern
          });
      });
    });

        Promise.all(orderDetailsPromises)
            .then(() => {
            // Warenkorb des Users in der DB löschen
            Card.destroy({
            where: {
                userid: userid
            }
            })
            .then(() => {
            res.json({ message: "Änderungen waren erfolgreich!", order: order.id});
            })
            .catch(error => {
            // Fehler beim Löschen der Karten behandeln
            res.status(500).send('Fehler beim Löschen der Karten');
            });
        })
        .catch(error => {
            // Fehler beim Erstellen der Orderdetails behandeln
            res.status(500).send('Fehler beim Ändern');
        });
    })
    .catch(error => {
        // Fehler beim Erstellen der Order behandeln
        res.status(500).send('Fehler beim Ändern');
    });
};