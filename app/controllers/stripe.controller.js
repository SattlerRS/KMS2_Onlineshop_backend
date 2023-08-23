const stripe = require('stripe')("sk_test_51NQSMoAYAs8K8FsBKQjhd0IGmAjHsS9PGaoubnufXU7JzkfDCk2q3ussEjVZxxwPeWNOSYUwuupshn0aeee6YfdM00GXNFm2Xs");


// Bezahlung durchführen üer Stripe
exports.StripePayment = async (req, res) => {
    try {
    const { token, amount} = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const charge = await stripe.charges.create({
      amount: amount*100,
      description: "Test Purchase",
      currency: "EUR",
      customer: customer.id,
    });

    res.json({ data: "success" });
  } catch (error) {
    res.json({ data: "failure" });
  }
 }