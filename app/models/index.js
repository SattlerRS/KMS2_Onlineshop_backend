const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.product = require("../models/product.model.js")(sequelize, Sequelize);
db.sellerdetails = require("../models/seller_details.model.js")(sequelize, Sequelize);
db.card = require("../models/card.model.js")(sequelize, Sequelize);
db.userdetails = require("../models/user_details.model.js")(sequelize, Sequelize);
db.order = require("../models/order.model.js")(sequelize, Sequelize);
db.orderdetails = require("../models/order_details.model.js")(sequelize, Sequelize);
db.rating = require("../models/rating.model.js")(sequelize, Sequelize);
db.watchlist = require("../models/watchlist.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.card.belongsTo(db.user, {
  foreignKey: 'userid'
}); 

db.card.belongsTo(db.product, {
  foreignKey: 'productid'
}); 

db.userdetails.belongsTo(db.user, {
  foreignKey: 'id'
});

db.order.belongsTo(db.user, {
  foreignKey: 'userid'
});

db.orderdetails.belongsTo(db.order, {
  foreignKey: 'orderid'
});

db.rating.belongsTo(db.user, {
  foreignKey: 'userid'
}); 

db.watchlist.belongsTo(db.product, {
  foreignKey: 'productid'
}); 


db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
