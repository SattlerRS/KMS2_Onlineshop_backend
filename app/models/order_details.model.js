module.exports = (sequelize, Sequelize) => {
  const Orderdetail = sequelize.define("orderdetails", {
    orderid: {
      type: Sequelize.INTEGER
      },
    price: {
      type: Sequelize.FLOAT,
    },
    amount: {
      type: Sequelize.INTEGER
    },
     productname: {
      type: Sequelize.STRING,
      allowNull: false 
    },
    productdescription: {
      type: Sequelize.STRING(500),
      allowNull: false 
    },
    productcategorie: {
      type: Sequelize.STRING,
      allowNull: false 
    },
    sellerid: {
      type: Sequelize.INTEGER,
      allowNull: false 
    },
    productid: {
      type: Sequelize.STRING,
      allowNull: false 
    },
    productprice: {
      type: Sequelize.FLOAT,
      allowNull: false 
    },
    images: {
      type: Sequelize.STRING(500),
      allowNull: true 
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true 
    },
  });

  return Orderdetail;
};
