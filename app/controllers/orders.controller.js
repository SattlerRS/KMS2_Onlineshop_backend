const db = require('../models');
const Order = db.order;
const Orderdetail = db.orderdetails;

// Bestellungen und Details für User abfragen
exports.getOrdersForUser = (req, res) => {
  const userId = req.params.userId;
  Order.findAll({
    where: { userid: userId },
  })
    .then(orders => {
      const orderIds = orders.map(order => order.id); // IDs der gefundenen Bestellungen

      Orderdetail.findAll({
        where: { orderid: orderIds },
      })
        .then(orderDetails => {
          res.send({ orders, orderDetails });
        })
        .catch(err => {
          res.status(500).json({
            message: "Beim Abrufen der Bestelldetails ist ein Fehler aufgetreten.",
            error: err.message
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "Beim Abrufen der Bestellungen ist ein Fehler aufgetreten.",
        error: err.message
      });
    });
};

// Bestellungendetails für Seller abfragen
exports.getOrdersForSeller = (req, res) => {
  const sellerid = req.params.sellerid;
  Orderdetail.findAll({
    where: { sellerid: sellerid },
  })
    .then(orderDetails => {
      res.send({ orderDetails });
    })    
    .catch(err => {
      res.status(500).json({
        message: "Beim Abrufen der Bestellungen ist ein Fehler aufgetreten.",
        error: err.message
      });
    });
};

 // Status der Bestellung ändern
exports.changeOrderDetailStatus = (req, res) => {
  const { Id, status } = req.body;

  Orderdetail.update({ status }, {
    where: { id: Id }
  })
    .then(numAffectedRows => {
      if (numAffectedRows[0] === 1) {
        res.status(200).json({ message: 'Bestelldaten erfolgreich geändert' });
      } else {
        res.status(404).json({ message: 'Bestelldaten nicht gefunden' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Interner Serverfehler' });
    });
}