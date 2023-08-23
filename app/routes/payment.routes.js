const paypalController = require("../controllers/paypal.controller");
const stripeController = require("../controllers/stripe.controller");
const token = require("../middleware/authJwt");

module.exports = function (app) {
  
  // Stripe
  app.post('/checkout', token.verifyToken, stripeController.StripePayment);
  
  // Paypal
  app.post('/paypal/proof', token.verifyToken, paypalController.PaypalProofPayment);
  app.post('/paypal/execute',token.verifyToken, paypalController.PaypalExecutePayment); 
}