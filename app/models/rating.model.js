module.exports = (sequelize, Sequelize) => {
  const Rating = sequelize.define("ratings", {
    userid: {
    type: Sequelize.INTEGER
      },
    productid: {
    type: Sequelize.INTEGER
      },
    rating: {
    type: Sequelize.INTEGER
      },
    header: {
    type: Sequelize.STRING(100),
    },
    text: {
    type: Sequelize.STRING(500),
      },
  });

  return Rating;
};
