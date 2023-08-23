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
      const orderIds = orders.map(order => order.id);

      Orderdetail.findAll({
        where: { orderid: orderIds },
      })
        .then(orderDetails => {
          res.send({ orders, orderDetails });
        })
        .catch(err => {
          res.status(500).json({
            message: "There was an error retrieving the order details",
            error: err.message
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "There was an error retrieving the order details",
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
        message: "There was an error retrieving the order details",
        error: err.message
      });
    });
};

 // Status der Bestellung ändern
exports.changeOrderDetailStatus = (req, res) => {
  const { Id, status } = req.body;

  // Staus ändern mit der jeweiligen id
  Orderdetail.update({ status }, {
    where: { id: Id }
  })
    //Wenn ein Status geändert wurde --> success
  .then(numAffectedRows => {
    if (numAffectedRows[0] === 1) {
      res.status(200).json({ message: 'Order details successfully changed' });
    } else {
      res.status(404).json({ message: 'Order data not found' });
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Internal Server Error' });
  });
}