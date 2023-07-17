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

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();

// routes
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

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
