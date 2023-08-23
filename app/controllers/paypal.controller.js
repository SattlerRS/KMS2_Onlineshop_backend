const paypal = require('paypal-rest-sdk');

// Paypal Konfiguration
paypal.configure({
  mode: 'sandbox', // sandbox für Testumgebung
  client_id: '',
  client_secret: ''
});

// Paypal Bezahlung überprüfen
exports.PaypalProofPayment = (req, res) => {
    const payment = req.body.payment;
    const paymentData = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        redirect_urls: {
            return_url: 'http://localhost:8081/checkout?paypal=proofed',
            cancel_url: 'http://localhost:8081/checkout'
           },
        transactions: [{
            amount: {
                total: payment,
                currency: 'EUR'
            },
            description: 'Testzahlung'
        }]
    };

    // Paypal Payment wird erstellt
    paypal.payment.create(paymentData, (error, payment) => {
        if (error) {
            res.sendStatus(500);
        } else {
            const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
            res.json({ approvalUrl }); 
        }
    });
};

// Paypal Bezahlung durchführen
exports.PaypalExecutePayment = (req, res) => { 
    const paymentId = req.body.paymentId;
    const payerId = req.body.payerId;

    const executePayment = {
        payer_id: payerId
        };

    paypal.payment.execute(paymentId, executePayment, (error, payment) => {
    if (error) {
        res.json('Error executing payment');
    } else {
        res.json('Payment successful!');
    }
    });
}
