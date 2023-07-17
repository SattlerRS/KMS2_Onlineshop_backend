module.exports = (sequelize, Sequelize) => {
  const Sellerdetails = sequelize.define("sellerdetails", {
    sellerid: {
    type: Sequelize.INTEGER
    },
    shopname: {
    type: Sequelize.STRING
      },
    description: {
    type: Sequelize.STRING
      },
    bankaccountnumber: {
    type: Sequelize.STRING
      },
    soldproducts: {
      type: Sequelize.INTEGER
    },
    tel: {
      type: Sequelize.STRING
    },
    street: {
      type: Sequelize.STRING
      },
    zip: {
      type: Sequelize.STRING
      },
    city: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    }
  });

  return Sellerdetails;
};
