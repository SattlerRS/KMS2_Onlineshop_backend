const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Datenbank mit Sequelize
const db = require("./app/models");
db.sequelize.sync();

// Routen
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/product.routes')(app);
require('./app/routes/profile.routes')(app);
require('./app/routes/card.routes')(app);
require('./app/routes/payment.routes')(app);
require('./app/routes/checkout.routes')(app);
require('./app/routes/orders.routes')(app);
require('./app/routes/rating.routes')(app);
require('./app/routes/watchlist.routes')(app);
require('./app/routes/newsletter.routes')(app);

// Port setzen und Server starten
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
