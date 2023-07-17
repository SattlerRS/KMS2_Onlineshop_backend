module.exports = (sequelize, Sequelize) => {
  const Watchlist = sequelize.define("watchlists", {
    userid: {
    type: Sequelize.INTEGER
      },
    productid: {
    type: Sequelize.INTEGER
      },
  });
  
  return Watchlist;
};
