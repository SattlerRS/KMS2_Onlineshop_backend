module.exports = (sequelize, Sequelize) => {
  const Card = sequelize.define("cards", {
    userid: {
    type: Sequelize.INTEGER
      },
    productid: {
    type: Sequelize.INTEGER
      },
    amount: {
    type: Sequelize.INTEGER
      },
  });

  return Card;
};
