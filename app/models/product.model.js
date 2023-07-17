module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("products", {
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
    productamount: {
      type: Sequelize.INTEGER,
      allowNull: false 
    },
    images: {
      type: Sequelize.STRING(500),
      allowNull: true 
    },
    proofed: {
      type: Sequelize.BOOLEAN,
      allowNull: true //
    },
    sold: {
      type: Sequelize.INTEGER,
      allowNull: false //
    },
    rating: {
      type: Sequelize.INTEGER,
    }
  });

  return Product;
};