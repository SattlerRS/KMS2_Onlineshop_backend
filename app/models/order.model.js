module.exports = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;
  const Order = sequelize.define("orders", {
    userid: {
      type: Sequelize.INTEGER
    },
    price: {
      type: Sequelize.FLOAT
    },
    orderDate: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  return Order;
};





